import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all candidates
export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' },
      include: { 
        department: true,
        campaign: true,
      },
    });
    
    // Transform database format to app format
    const transformedCandidates = candidates.map(c => ({
      ...c,
      education: JSON.parse(c.education || '{}'),
      assignedQuestions: c.assignedQuestions ? JSON.parse(c.assignedQuestions) : [],
      answers: c.answers ? JSON.parse(c.answers) : [],
    }));
    
    return NextResponse.json(transformedCandidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}

// POST create candidate
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const candidate = await prisma.candidate.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        education: JSON.stringify(body.education || {}),
        preferredDepartmentId: body.preferredDepartmentId,
        campaignId: body.campaignId,
        status: body.status || 'not_started',
        assignedQuestions: JSON.stringify(body.assignedQuestions || []),
        answers: JSON.stringify(body.answers || []),
        score: body.score || 0,
        tempPassword: body.tempPassword || `temp${Math.floor(Math.random() * 10000)}`,
        interviewStartedAt: body.interviewStartedAt,
        interviewCompletedAt: body.interviewCompletedAt,
      },
      include: {
        department: true,
        campaign: true,
      },
    });
    
    // Transform database format to app format
    const transformedCandidate = {
      ...candidate,
      education: JSON.parse(candidate.education || '{}'),
      assignedQuestions: candidate.assignedQuestions ? JSON.parse(candidate.assignedQuestions) : [],
      answers: candidate.answers ? JSON.parse(candidate.answers) : [],
    };
    
    return NextResponse.json(transformedCandidate);
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
  }
}

