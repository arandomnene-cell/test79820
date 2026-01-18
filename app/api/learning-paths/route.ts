// maybe not needed

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const paths = await prisma.learningPath.findMany({
      orderBy: { title: "asc" },
    });

    return NextResponse.json(paths);
  } catch (error) {
    console.error("Get learning paths error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
