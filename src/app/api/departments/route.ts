import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all departments
export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
  }
}

// POST create department
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const department = await prisma.department.create({
      data: {
        name: body.name,
        description: body.description,
      },
    });
    return NextResponse.json(department);
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json({ error: 'Failed to create department' }, { status: 500 });
  }
}

