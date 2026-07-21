import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";
import { reverseGeocode } from "@/lib/geocoding"; // Added Reverse Geocoding

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

    const prompt = `
  You are EcoLens AI.
  
  Analyze this pollution report.
  
  Description:
  ${description}
  
  Location:
  Latitude: ${latitude}
  Longitude: ${longitude}
  
  User Category:
  ${category || "Auto Detect"}
  
  User Severity:
  ${severity || "Auto Detect"}
  
  Return ONLY valid JSON.
  
  {
    "pollution_type":"",
    "confidence":0,
    "severity":"",
    "likely_source":"",
    "aqi_prediction":0,
    "health_risk":"",
    "recommended_action":"",
    "summary":""
  }
  
  Do not use markdown.
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
      analysis = JSON.parse(text);
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

    // Convert coordinates to numbers for geocoding and database
    const latNum = Number(latitude);
    const lonNum = Number(longitude);

    // Fetch the human-readable location data
    const locationData = await reverseGeocode(latNum, lonNum);

    // Save report to PostgreSQL
    const savedReport = await prisma.pollutionReport.create({
      data: {
        description,
        imageUrl,
        latitude: latNum,
        longitude: lonNum,

        // Inject the newly fetched location details
        county: locationData.county,
        subCounty: locationData.subCounty,
        ward: locationData.ward,
        area: locationData.area,
        displayLocation: locationData.displayLocation,

        userCategory: category || null,
        userSeverity: severity || null,
        pollutionType: analysis.pollution_type,
        confidence: Math.round(Number(analysis.confidence) * 100),
        severity: analysis.severity,
        likelySource: analysis.likely_source,
        predictedAQI: Number(analysis.aqi_prediction),
        healthRisk: analysis.health_risk,
        recommendation: analysis.recommended_action,
        summary: analysis.summary,
      },
    });

    return NextResponse.json({
      success: true,
      reportId: savedReport.id,
      analysis,
    });
  } catch (error: unknown) {
    console.error(error);

    // Safely extract the error message to avoid using 'any'
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