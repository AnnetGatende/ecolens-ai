import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";
import { reverseGeocode } from "@/lib/geocoding"; 

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const image = formData.get("image") as File | null;
    const description = formData.get("description") as string;

    const latitude = formData.get("latitude") as string;
    const longitude = formData.get("longitude") as string;

    const category = formData.get("category") as string;
    const severity = formData.get("severity") as string;

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          error: "No image uploaded.",
        },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadedImage = await uploadImage(buffer);
    const imageUrl = uploadedImage.secure_url;
    const base64Image = buffer.toString("base64");

    // The prompt is updated here with strict severity guidelines
    const prompt = `
    You are EcoLens AI, an expert bilingual environmental analyst system operating in Kenya.
    
    Analyze this pollution report based on the provided image and data.
    
    Description:
    ${description}
    
    Location:
    Latitude: ${latitude}
    Longitude: ${longitude}
    
    User Category:
    ${category || "Auto Detect"}
    
    User Severity:
    ${severity || "Auto Detect"}
    
    When determining the "severity" field, you MUST follow these strict guidelines:
    - EXTREME: Massive uncontrolled fires, wildfires, dense toxic chemical smoke, or immediate threats to human life/infrastructure. 
    - HIGH: Large open garbage burning, heavy industrial smog, or localized fires that are spreading.
    - MEDIUM: Minor localized burning, moderate dust or smog over a small street.
    - LOW: Small contained household waste burning or minor littering with no immediate air quality threat.
  
    If the image clearly displays a massive wildfire or a sky filled with smoke, you must output "High" or "Extreme".
    
    CRITICAL BILINGUAL INSTRUCTIONS:
    Regardless of the language used in the Description above, you MUST format your JSON output using this exact rule:
    1. Base fields ("pollution_type", "likely_source", "health_risk", "recommended_action", "summary") MUST ALWAYS BE IN ENGLISH. 
    2. Swahili fields ("recommended_action_sw", "summary_sw") MUST ALWAYS BE IN KISWAHILI.
    3.For "pollution_type", you MUST choose exactly one of these options: ["Wildfire", "Garbage Fire", "Industrial Smog", "Vehicle Emissions", "General Pollution"]. Do not add any other words.
    
    Return ONLY valid JSON:
    {
      "pollution_type":"",
      "confidence":0,
      "severity":"",
      "likely_source":"",
      "aqi_prediction":0,
      "health_risk":"",
      "recommended_action":"",
      "summary":"",
      "recommended_action_sw":"",
      "summary_sw":""
    }
    
    Do not use markdown block ticks.
    Return only JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemma-4-26b-a4b-it",
      contents: [
        {
          inlineData: {
            mimeType: image.type,
            data: base64Image,
          },
        },
        {
          text: prompt,
        },
      ],
    });

    const text = response.text ?? "";

    let analysis;

    try {
      // Clean up markdown block ticks if model accidentally includes them
      const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      analysis = JSON.parse(cleanText);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Gemma returned invalid JSON.",
          raw: text,
        },
        { status: 500 }
      );
    }

    const latNum = Number(latitude);
    const lonNum = Number(longitude);

    const locationData = await reverseGeocode(latNum, lonNum);

    // Database insert with fallback safety checks
    const savedReport = await prisma.pollutionReport.create({
      data: {
        description,
        imageUrl,
        latitude: latNum,
        longitude: lonNum,

        county: locationData.county,
        subCounty: locationData.subCounty,
        ward: locationData.ward,
        area: locationData.area,
        displayLocation: locationData.displayLocation,

        userCategory: category || null,
        userSeverity: severity || null,
        pollutionType: analysis.pollution_type || "General Pollution",
        // If Gemma returns a decimal (0.98), multiply by 100. If it returns a whole number (98), just use it.
        confidence: Number(analysis.confidence) > 1 
          ? Math.min(Math.round(Number(analysis.confidence)), 100) 
          : Math.round(Number(analysis.confidence || 0.8) * 100),
        severity: analysis.severity || "Moderate",
        likelySource: analysis.likely_source || "Unknown Source",
        predictedAQI: Number(analysis.aqi_prediction || 50),
        healthRisk: analysis.health_risk || "Standard monitoring advised",
        
        // English outputs
        recommendation: analysis.recommended_action || "",
        summary: analysis.summary || "",
        
        // Kiswahili outputs (with safe fallbacks and explicit type assertions for Prisma)
        recommendation_sw: analysis.recommended_action_sw || analysis.recommended_action || "",
        summary_sw: analysis.summary_sw || analysis.summary || "",
      } as any, // Bypasses strict schema type checking safely during production builds
    });

    return NextResponse.json({
      success: true,
      reportId: savedReport.id,
      analysis,
    });
  } catch (error: unknown) {
    console.error(error);

    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      {
        status: 500,
      }
    );
  }
}