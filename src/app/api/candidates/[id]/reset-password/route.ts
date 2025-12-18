import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/candidates/[id]/reset-password - Reset candidate password
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const candidateId = params.id;

    // Get candidate
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }

    // Generate new temporary password
    const newTempPassword = `temp${Math.floor(1000 + Math.random() * 9000)}`;

    // Update candidate with new password
    const updatedCandidate = await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        tempPassword: newTempPassword,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Password reset successfully',
      candidateId: updatedCandidate.id,
      tempPassword: updatedCandidate.tempPassword,
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}

