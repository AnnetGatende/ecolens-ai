import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const reports = await prisma.pollutionReport.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        pollutionType: true,
        severity: true,
        predictedAQI: true,
        latitude: true,
        longitude: true,
        imageUrl: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to load reports" },
      { status: 500 }
    );
  }
}