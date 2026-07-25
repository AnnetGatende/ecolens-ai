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
    const clientLocationString = formData.get("locationString") as string | null;

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
    1. For "severity", you MUST choose exactly one of these FIVE English options based on the visual hazard: 
       ["Low", "Moderate", "High", "Severe", "Critical"].
    2. For "severity_sw", you MUST choose exactly one corresponding Swahili option matching the English choice above:
       ["Chini", "Wastani", "Juu", "Vikali", "Hatari"].
       SCIENTIFIC CALIBRATION RULES:
    - Assess the SCALE and DURATION of the event. 
    - Temporary, highly localized events (e.g., a vehicle burnout, a single burning trash can, dust from a passing truck) MUST be categorized as "Low" or "Moderate". 
    - Only reserve "Severe" or "Critical" for massive, sustained, wide-area events (e.g., raging forest fires, massive toxic chemical spills, heavy industrial smog covering a skyline).
    3. "aqi_prediction": You must calculate an integer Air Quality Index (AQI) score. The AQI number MUST strictly match the severity category:
       - Low/Chini: AQI 0 to 50
       - Moderate/Wastani: AQI 51 to 100
       - High/Juu: AQI 101 to 150
       - Severe/Vikali: AQI 151 to 200
       - Critical/Hatari: AQI 201 to 500
    4. For "pollution_type", choose a concise English category.
    5. Translate the user's original raw description into formal English ("description_en") and fluent Kiswahili ("description_sw").
    6. You MUST provide BOTH English and Kiswahili versions for all other descriptive fields.
  
    Return ONLY valid JSON matching this exact structure:
    {
      "description_en": "English translation of description",
      "description_sw": "Swahili translation of description",
      "pollution_type": "English type",
      "pollution_type_sw": "Kiswahili type",
      "confidence": 98,
      "severity": "Critical",
      "severity_sw": "Hatari",
      "likely_source": "English source",
      "likely_source_sw": "Kiswahili source",
      "aqi_prediction": 250,
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

    const county = locationData.county || "Mombasa";
    const subCounty = (locationData as any).subCounty || (locationData as any).location || "Unknown";
    const ward = locationData.ward || "Unknown";
    const area = (locationData as any).area || null;
    const displayLocation = locationData.displayLocation || clientLocationString || `County - ${county}, Location - ${subCounty}, Ward - ${ward}`;

    const savedReport = await prisma.pollutionReport.create({
      data: {
        description,
        imageUrl,
        latitude: latNum,
        longitude: lonNum,
        county,
        subCounty,
        ward,
        area,
        displayLocation,
        userCategory: category || null,
        userSeverity: severity || null,
        
        confidence: Number(analysis.confidence) > 1 
          ? Math.min(Math.round(Number(analysis.confidence)), 100) 
          : Math.round(Number(analysis.confidence || 0.8) * 100),
        
        // Strict mapping saved directly to DB
        severity: analysis.severity || "Moderate",
        severity_sw: analysis.severity_sw || "Wastani",
        predictedAQI: Number(analysis.aqi_prediction || 55),

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