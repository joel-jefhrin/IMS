import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/auth/candidate - Authenticate candidate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, tempPassword } = body;

    if (!email || !tempPassword) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find candidate by email and tempPassword
    const candidate = await prisma.candidate.findFirst({
      where: {
        email: email.toLowerCase(),
        tempPassword: tempPassword,
      },
      include: {
        campaign: {
          include: {
            department: true,
          },
        },
        department: true,
      },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if campaign is active
    if (candidate.campaign.status !== 'active') {
      return NextResponse.json(
        { error: 'This campaign is not currently active' },
        { status: 403 }
      );
    }

    // Transform data before sending
    const transformedCandidate = {
      ...candidate,
      education: JSON.parse(candidate.education || '{}'),
      assignedQuestions: candidate.assignedQuestions 
        ? JSON.parse(candidate.assignedQuestions) 
        : [],
      answers: candidate.answers ? JSON.parse(candidate.answers) : [],
    };

    // Return candidate data (excluding sensitive info)
    return NextResponse.json({
      id: transformedCandidate.id,
      firstName: transformedCandidate.firstName,
      lastName: transformedCandidate.lastName,
      email: transformedCandidate.email,
      status: transformedCandidate.status,
      campaignId: transformedCandidate.campaignId,
      campaign: transformedCandidate.campaign,
      department: transformedCandidate.department,
      assignedQuestions: transformedCandidate.assignedQuestions,
      answers: transformedCandidate.answers,
      interviewStartedAt: transformedCandidate.interviewStartedAt,
      interviewCompletedAt: transformedCandidate.interviewCompletedAt,
    });
  } catch (error) {
    console.error('Error authenticating candidate:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

