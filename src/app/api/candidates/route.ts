import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Utility to safely parse JSON
function safeParse(str: string | null | undefined, fallback: any) {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch {
    return fallback;
  }
}

// GET all candidates
export async function GET() {
  try {
    console.log("API hit");
    const candidates = await prisma.candidate.findMany({
      orderBy: { createdAt: "desc" },
      // include: {
      //   department: true,
      //   campaign: true,
      // },
    });
    console.log(candidates);

    const transformedCandidates = candidates.map((c) => ({
      ...c,
      education: safeParse(c.education, {}),
      assignedQuestions: safeParse(c.assignedQuestions, []),
      answers: safeParse(c.answers, []),
    }));

    return NextResponse.json(transformedCandidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}

// POST create a candidate
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body);
    const candidate = await prisma.candidate.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        education: JSON.stringify(body.education || {}),
        preferredDepartmentId: body.preferredDepartmentId || null,
        campaignId: body.campaignId || null,
        status: body.status || "in progress",
        assignedQuestions: JSON.stringify(body.assignedQuestions || []),
        answers: JSON.stringify(body.answers || []),
        score: body.score ?? 0,
        tempPassword:
          body.tempPassword || `temp${Math.floor(Math.random() * 10000)}`,
        interviewStartedAt: body.interviewStartedAt || null,
        interviewCompletedAt: body.interviewCompletedAt || null,
      },
    });

    const transformedCandidate = {
      ...candidate,
      education: safeParse(candidate.education, {}),
      assignedQuestions: safeParse(candidate.assignedQuestions, []),
      answers: safeParse(candidate.answers, []),
    };

    return NextResponse.json(transformedCandidate);
  } catch (error) {
    console.error("Error creating candidate:", error);
    return NextResponse.json(
      { error: "Failed to create candidate" },
      { status: 500 }
    );
  }
}
