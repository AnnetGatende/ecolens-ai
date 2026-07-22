import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ Id: string }> }
) {
  try {
    const params = await props.params;
    const reportId = params.Id;

    const report = await prisma.pollutionReport.findUnique({
      where: {
        id: reportId, // Maps the capital URL param to your Prisma 'id' field
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
      { error: "Server Error" },
      { status: 500 }
    );
  }
}