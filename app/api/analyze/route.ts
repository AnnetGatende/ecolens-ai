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
      return NextResponse.json({ success: false, error: "No image uploaded." }, { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadedImage = await uploadImage(buffer);
    const imageUrl = uploadedImage.secure_url;
    const base64Image = buffer.toString("base64");

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
  
  CRITICAL SYSTEM CONSTRAINTS & BILINGUAL INSTRUCTIONS:
  1. For "severity", you MUST choose exactly one of these three options: ["Low", "Medium", "High"]. Do NOT output "Extreme".
     - If the image shows a massive wildfire, you MUST output "High".
  2. For "pollution_type", choose a concise English category (e.g., "Smoke", "Dust", "Garbage Burning").
  3. "aqi_prediction": YOU must dynamically calculate and predict an integer Air Quality Index (AQI) score from 0 to 500 based on the severity of the hazard. Do not use a fixed number.
  4. You MUST provide BOTH English and Kiswahili versions for all descriptive fields.

  Return ONLY valid JSON matching this exact structure:
  {
    "pollution_type": "English type",
    "pollution_type_sw": "Kiswahili type",
    "confidence": 98,
    "severity": "High",
    "likely_source": "English source",
    "likely_source_sw": "Kiswahili source",
    "aqi_prediction": 150,
    "health_risk": "English health risk",
    "health_risk_sw": "Kiswahili health risk",
    "recommended_action": "English action",
    "recommended_action_sw": "Kiswahili action",
    "summary": "English summary",
    "summary_sw": "Kiswahili summary"
  }
  
  Do not use markdown block ticks. Return only JSON.
  `;

    const response = await ai.models.generateContent({
      model: "gemma-4-26b-a4b-it",
      contents: [
        { inlineData: { mimeType: image.type, data: base64Image } },
        { text: prompt },
      ],
    });

    const text = response.text ?? "";

    let analysis;
    try {
      const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      analysis = JSON.parse(cleanText);
    } catch {
      return NextResponse.json({ success: false, error: "Gemma returned invalid JSON.", raw: text }, { status: 500 });
    }

    const latNum = Number(latitude);
    const lonNum = Number(longitude);
    const locationData = await reverseGeocode(latNum, lonNum);

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
        
        confidence: Number(analysis.confidence) > 1 
          ? Math.min(Math.round(Number(analysis.confidence)), 100) 
          : Math.round(Number(analysis.confidence || 0.8) * 100),
        
        severity: analysis.severity || "Medium",
        predictedAQI: Number(analysis.aqi_prediction || 50),

        pollutionType: analysis.pollution_type || "General Pollution",
        pollutionType_sw: analysis.pollution_type_sw || analysis.pollution_type,
        
        likelySource: analysis.likely_source || "Unknown Source",
        likelySource_sw: analysis.likely_source_sw || analysis.likely_source,
        
        healthRisk: analysis.health_risk || "Standard monitoring advised",
        healthRisk_sw: analysis.health_risk_sw || analysis.health_risk,
        
        recommendation: analysis.recommended_action || "",
        recommendation_sw: analysis.recommended_action_sw || analysis.recommended_action || "",
        
        summary: analysis.summary || "",
        summary_sw: analysis.summary_sw || analysis.summary || "",
      } as any, 
    });

    return NextResponse.json({ success: true, reportId: savedReport.id, analysis });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}