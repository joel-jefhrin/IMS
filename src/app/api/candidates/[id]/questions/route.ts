import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/candidates/[id]/questions - Get assigned questions for a candidate
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const candidateId = params.id;

    // Get candidate with campaign
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        campaign: true,
      },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    // Parse questionSetIds from campaign
    const questionSetIds = JSON.parse(
      candidate?.campaign?.questionSetIds || "[]"
    );

    if (questionSetIds.length === 0) {
      return NextResponse.json(
        { error: "No questions assigned to this campaign" },
        { status: 404 }
      );
    }

    // Get questions by IDs
    const questions = await prisma.question.findMany({
      where: {
        id: {
          in: questionSetIds,
        },
      },
      include: {
        department: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Transform questions (parse JSON fields)
    const transformedQuestions = questions.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      answerType: q.answerType,
      departmentId: q.departmentId,
      department: q.department,
      difficulty: q.difficulty,
      skillType: q.skillType,
      tags: JSON.parse(q.tags || "[]"),
      marks: q.marks,
      options: q.options ? JSON.parse(q.options) : undefined,
      correctAnswer: q.correctAnswer ? JSON.parse(q.correctAnswer) : undefined,
      codeTemplate: q.codeTemplate,
      rubric: q.rubric,
      fileTypes: q.fileTypes ? JSON.parse(q.fileTypes) : undefined,
      ratingScale: q.ratingScale,
      solutionTemplate: q.solutionTemplate,
    }));

    // Return campaign info along with questions
    return NextResponse.json({
      campaign: {
        id: candidate?.campaign?.id,
        name: candidate?.campaign?.name,
        description: candidate?.campaign?.description,
        durationPerCandidate: candidate?.campaign?.durationPerCandidate,
        questionsPerCandidate: candidate?.campaign?.questionsPerCandidate,
        passingScore: candidate?.campaign?.passingScore,
      },
      questions: transformedQuestions,
      totalQuestions: transformedQuestions.length,
    });
  } catch (error) {
    console.error("Error fetching candidate questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
