import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { Id: string } }
) {
  try {
    const reportId = params.Id;

    // Use findUnique to get a single report. 
    // No 'select' block means it returns all fields, including displayLocation.
    const report = await prisma.pollutionReport.findUnique({
      where: {
        id: reportId,
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}