import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const slugOrId = params.slug;
    if (!slugOrId) {
      return NextResponse.json({ error: 'Slug required' }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ slug: slugOrId }, { id: slugOrId }],
        isActive: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}
