import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all campaigns
export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: { department: true },
    });
    
    // Transform database format to app format
    const transformedCampaigns = campaigns.map(c => ({
      ...c,
      questionSetIds: JSON.parse(c.questionSetIds || '[]'),
    }));
    
    return NextResponse.json(transformedCampaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

// POST create campaign
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const campaign = await prisma.campaign.create({
      data: {
        name: body.name,
        description: body.description,
        departmentId: body.departmentId,
        startDate: body.startDate,
        endDate: body.endDate,
        durationPerCandidate: body.durationPerCandidate,
        status: body.status || 'draft',
        questionSetIds: JSON.stringify(body.questionSetIds || []),
        questionsPerCandidate: body.questionsPerCandidate,
        isRandomized: body.isRandomized ?? true,
        passingScore: body.passingScore,
        passingCriteria: body.passingCriteria,
        totalCandidates: 0,
        completedCandidates: 0,
        averageScore: 0,
        createdBy: body.createdBy || 'admin',
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
    console.error('Error creating campaign:', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}

