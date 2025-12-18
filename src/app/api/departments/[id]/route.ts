import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single department
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const department = await prisma.department.findUnique({
      where: { id: params.id },
    });
    
    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }
    
    return NextResponse.json(department);
  } catch (error) {
    console.error('Error fetching department:', error);
    return NextResponse.json({ error: 'Failed to fetch department' }, { status: 500 });
  }
}

// PUT update department
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const department = await prisma.department.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
      },
    });
    return NextResponse.json(department);
  } catch (error) {
    console.error('Error updating department:', error);
    return NextResponse.json({ error: 'Failed to update department' }, { status: 500 });
  }
}

// DELETE department
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.department.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json({ error: 'Failed to delete department' }, { status: 500 });
  }
}

