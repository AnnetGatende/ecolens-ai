import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client"; // ADDED: Import Prisma types

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Check if the request is coming securely from the admin panel
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    // ADDED: Explicitly type the whereClause to fix the TypeScript Enum error
    const whereClause: Prisma.PollutionReportWhereInput = isAdmin ? {} : {
      OR: [
        { confidence: { gte: 85 } },
        { status: "RESOLVED" } // Allows manually approved reports to bypass the AI filter
      ]
    };

    const reports = await prisma.pollutionReport.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
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