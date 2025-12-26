import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// ✅ REQUIRED for preflight
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3001",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    }
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const candidateId = params.id;
    const body = await request.json();

    const { answers, interviewStartedAt, interviewCompletedAt } = body;

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        answers: JSON.stringify(answers),
        status: "completed",
        interviewStartedAt,
        interviewCompletedAt,
      },
    });

    return NextResponse.json(
      {
        message: "Interview submitted successfully",
        candidateId: updatedCandidate.id,
      }
      // { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit interview" },
      { status: 500, headers: corsHeaders }
    );
  }
}
