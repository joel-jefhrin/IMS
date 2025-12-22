import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Handle preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const { email, tempPassword } = await request.json();

    if (!email || !tempPassword) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const candidate = await prisma.candidate.findFirst({
      where: {
        email: email.toLowerCase(),
        tempPassword,
      },
      include: {
        campaign: true,
       
      },
    });

    console.log("Candidate:", candidate);

    if (!candidate) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 🔥 SAFETY CHECK (IMPORTANT)
    if (!candidate.campaign) {
      return NextResponse.json(
        { error: "Campaign not found for candidate" },
        { status: 500 }
      );
    }

    // Check campaign status
    if (candidate.campaign.status !== "active") {
      return NextResponse.json(
        { error: "This campaign is not currently active" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      status: candidate.status,
      campaignId: candidate.campaignId,
      campaign: candidate.campaign,
      // department: candidate.department,
      assignedQuestions: JSON.parse(candidate.assignedQuestions || "[]"),
      answers: JSON.parse(candidate.answers || "[]"),
      interviewStartedAt: candidate.interviewStartedAt,
      interviewCompletedAt: candidate.interviewCompletedAt,
    });
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
