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

export async function GET(request, { params }) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
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

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const imagesArray = normalizeImagesArray(data.images);
    const slugRaw = data.slug != null ? (String(data.slug).trim() || generateSlug(data.title)) : undefined;
    const slug = slugRaw != null && String(slugRaw).trim() ? String(slugRaw).trim() : null;

    const parseDate = (v) => {
      if (v == null || v === '') return null;
      const d = new Date(v);
      return isNaN(d.getTime()) ? null : d;
    };

    const updateData = {
      title: data.title,
      description: data.description,
      category: data.category,
      location: data.location,
      images: imagesArray,
      status: data.status,
      isFeatured: data.isFeatured ?? false,
      isActive: data.isActive ?? true,
      priority: data.priority ?? 0,
      completedAt: parseDate(data.completedAt),
      slug,
      startDate: parseDate(data.startDate),
      budget: data.budget != null ? String(data.budget).trim() || null : null,
    };

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(project);
  } catch (error) {
    const message = error?.message || 'Failed to update project';
    const code = error?.code;
    if (code === 'P2025') {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    if (code === 'P2002') {
      return NextResponse.json({ error: 'Slug is already used by another project' }, { status: 400 });
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    const imagesArray = normalizeImagesArray(data.images);
    const project = await prisma.project.update({
      where: { id: params.id },
      data: { images: imagesArray },
    });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update project images' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
