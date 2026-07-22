import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { reportIds, action } = await req.json();

    if (!reportIds || !Array.isArray(reportIds)) {
      return NextResponse.json({ error: "Invalid report IDs" }, { status: 400 });
    }

    // Determine the new status based on the action
    const newStatus = action === "revoke" ? "PENDING" : "RESOLVED";

    // Update only the exact reports belonging to the clicked hotspot
    await prisma.pollutionReport.updateMany({
      where: { 
        id: { in: reportIds } 
      },
      data: { 
        status: newStatus 
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Dispatch Error:", error);
    return NextResponse.json(
      { error: "Failed to dispatch/revoke resources" }, 
      { status: 500 }
    );
  }
}