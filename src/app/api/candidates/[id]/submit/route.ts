import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}

// POST /api/candidates/[id]/submit - Submit candidate answers
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const candidateId = params.id;
    const body = await request.json();
    const {
      answers,
      interviewStartedAt,
      interviewCompletedAt,
      score: clientScore,
    } = body;

    // Get candidate
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    // Calculate score
    // Prefer client-provided score if sent; otherwise, approximate based on answered questions vs assigned set
    let score = 0;
    if (typeof clientScore === "number" && !Number.isNaN(clientScore)) {
      score = clientScore;
    } else {
      const answeredCount = answers ? Object.keys(answers).length : 0;
      // Try to infer total questions from the campaign
      const campaign = candidate.campaignId
        ? await prisma.campaign.findUnique({
            where: { id: candidate.campaignId },
          })
        : null;
      const totalQuestions = campaign?.questionSetIds
        ? JSON.parse(campaign.questionSetIds || "[]").length
        : 0;
      const denominator = totalQuestions > 0 ? totalQuestions : 10; // fallback
      score = Math.round((answeredCount / denominator) * 100);
    }

    // Update candidate with answers and completion status
    const updatedCandidate = await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        answers: JSON.stringify(answers),
        status: "completed",
        score: score,
        interviewStartedAt: interviewStartedAt,
        interviewCompletedAt: interviewCompletedAt,
      },
    });

    return NextResponse.json({
      message: "Interview submitted successfully",
      candidateId: updatedCandidate.id,
      status: updatedCandidate.status,
      score: updatedCandidate.score,
    });
  } catch (error) {
    console.error("Error submitting interview:", error);
    return NextResponse.json(
      { error: "Failed to submit interview" },
      { status: 500 }
    );
  }
}
