import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function normalizeImagesArray(value) {
  if (Array.isArray(value)) {
    return value.filter((u) => u != null && typeof u === 'string' && u.trim() !== '').map((u) => String(u).trim());
  }
  if (typeof value === 'string' && value.trim() !== '') return [value.trim()];
  return [];
}

function generateSlug(title) {
  if (!title || typeof title !== 'string') return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || '';
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const imagesArray = normalizeImagesArray(data.images);
    const slugRaw = (data.slug && String(data.slug).trim()) || generateSlug(data.title);
    const slug = slugRaw && slugRaw.trim() ? slugRaw.trim() : null;

    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        images: imagesArray,
        ...(slug != null && { slug }),
        startDate: data.startDate ? new Date(data.startDate) : null,
        budget: data.budget != null ? String(data.budget).trim() || null : null,
        status: data.status || 'ACTIVE',
        isFeatured: data.isFeatured ?? false,
        isActive: data.isActive ?? true,
        priority: data.priority ?? 0,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
