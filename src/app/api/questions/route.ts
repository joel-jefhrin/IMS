import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all questions
export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: "desc" },
      include: { department: true },
    });

    // Transform database format to app format
    const transformedQuestions = questions.map((q: any) => ({
      ...q,
      tags: JSON.parse(q.tags || "[]"),
      options: q.options ? JSON.parse(q.options) : undefined,
      correctAnswer: q.correctAnswer ? JSON.parse(q.correctAnswer) : undefined,
      fileTypes: q.fileTypes ? JSON.parse(q.fileTypes) : undefined,
    }));

    return NextResponse.json(transformedQuestions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// POST create question
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const question = await prisma.question.create({
      data: {
        title: body.title,
        description: body.description,
        answerType: body.answerType,
        departmentId: body.departmentId,
        difficulty: body.difficulty,
        skillType: body.skillType,
        tags: JSON.stringify(body.tags || []),
        marks: body.marks || 10,
        options: body.options ? JSON.stringify(body.options) : null,
        correctAnswer: body.correctAnswer
          ? JSON.stringify(body.correctAnswer)
          : null,
        codeTemplate: body.codeTemplate,
        rubric: body.rubric,
        fileTypes: body.fileTypes ? JSON.stringify(body.fileTypes) : null,
        ratingScale: body.ratingScale,
        solutionTemplate: body.solutionTemplate,
        createdBy: body.createdBy || "admin",
      },
      include: { department: true },
    });

    // Transform database format to app format
    const transformedQuestion = {
      ...question,
      tags: JSON.parse(question.tags || "[]"),
      options: question.options ? JSON.parse(question.options) : undefined,
      correctAnswer: question.correctAnswer
        ? JSON.parse(question.correctAnswer)
        : undefined,
      fileTypes: question.fileTypes
        ? JSON.parse(question.fileTypes)
        : undefined,
    };

    return NextResponse.json(transformedQuestion);
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
