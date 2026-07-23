import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// 1. Fetch all reports for the Map
export async function GET() {
  try {
    const reports = await prisma.pollutionReport.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

// 2. Create a new report
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newReport = await prisma.pollutionReport.create({
      data: {
        // Citizen Report fields
        description: body.description,
        imageUrl: body.imageUrl,
        latitude: body.latitude,
        longitude: body.longitude,
        
        // Human-Readable Location (Optional)
        displayLocation: body.displayLocation,
        
        // Gemma AI Analysis (Required by your schema)
        pollutionType: body.pollutionType,
        confidence: body.confidence,
        severity: body.severity,
        likelySource: body.likelySource,
        predictedAQI: body.predictedAQI,
        healthRisk: body.healthRisk,
        recommendation: body.recommendation,
        summary: body.summary,
        
        // status is automatically set to PENDING by your schema default
      },
    });

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}