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

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ Id: string }> }
) {
  try {
    // Resolve the params promise just like in the GET request
    const params = await props.params;
    const reportId = params.Id;

    // Tell Prisma to delete the record matching this ID
    await prisma.pollutionReport.delete({
      where: {
        id: reportId,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Report deleted successfully." 
    });
  } catch (error) {
    console.error("Delete Error:", error);

    // If Prisma fails to find the ID to delete, it will throw an error caught here
    return NextResponse.json(
      { success: false, error: "Failed to delete report. It may have already been removed." },
      { status: 500 }
    );
  }
}