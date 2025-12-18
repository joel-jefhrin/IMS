import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT update candidate
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    
    const candidate = await prisma.candidate.update({
      where: { id: params.id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        education: JSON.stringify(body.education || {}),
        preferredDepartmentId: body.preferredDepartmentId,
        campaignId: body.campaignId,
        status: body.status,
        assignedQuestions: JSON.stringify(body.assignedQuestions || []),
        answers: JSON.stringify(body.answers || []),
        score: body.score || 0,
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
    console.error('Error updating candidate:', error);
    return NextResponse.json({ error: 'Failed to update candidate' }, { status: 500 });
  }
}

// DELETE candidate
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.candidate.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json({ error: 'Failed to delete candidate' }, { status: 500 });
  }
}

