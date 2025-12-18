import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT update question
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    
    const question = await prisma.question.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        answerType: body.answerType,
        departmentId: body.departmentId,
        difficulty: body.difficulty,
        skillType: body.skillType,
        tags: JSON.stringify(body.tags || []),
        marks: body.marks || 10,
        options: body.options ? JSON.stringify(body.options) : null,
        correctAnswer: body.correctAnswer ? JSON.stringify(body.correctAnswer) : null,
        codeTemplate: body.codeTemplate,
        rubric: body.rubric,
        fileTypes: body.fileTypes ? JSON.stringify(body.fileTypes) : null,
        ratingScale: body.ratingScale,
        solutionTemplate: body.solutionTemplate,
      },
      include: { department: true },
    });
    
    // Transform database format to app format
    const transformedQuestion = {
      ...question,
      tags: JSON.parse(question.tags || '[]'),
      options: question.options ? JSON.parse(question.options) : undefined,
      correctAnswer: question.correctAnswer ? JSON.parse(question.correctAnswer) : undefined,
      fileTypes: question.fileTypes ? JSON.parse(question.fileTypes) : undefined,
    };
    
    return NextResponse.json(transformedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
  }
}

// DELETE question
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.question.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}

