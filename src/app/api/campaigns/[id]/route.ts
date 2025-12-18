import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT update campaign
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    
    const campaign = await prisma.campaign.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        departmentId: body.departmentId,
        startDate: body.startDate,
        endDate: body.endDate,
        durationPerCandidate: body.durationPerCandidate,
        status: body.status,
        questionSetIds: JSON.stringify(body.questionSetIds || []),
        questionsPerCandidate: body.questionsPerCandidate,
        isRandomized: body.isRandomized,
        passingScore: body.passingScore,
        passingCriteria: body.passingCriteria,
      },
      include: { department: true },
    });
    
    // Transform database format to app format
    const transformedCampaign = {
      ...campaign,
      questionSetIds: JSON.parse(campaign.questionSetIds || '[]'),
    };
    
    return NextResponse.json(transformedCampaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
  }
}

// DELETE campaign
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.campaign.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
  }
}

