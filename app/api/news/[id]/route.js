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
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(request, { params }) {
  try {
    const article = await prisma.news.findUnique({
      where: { id: params.id },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch article' },
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
    const slug = data.slug || generateSlug(data.title);

    const existingArticle = await prisma.news.findUnique({
      where: { id: params.id },
    });
    const imagesArray = normalizeImagesArray(data.images);

    const article = await prisma.news.update({
      where: { id: params.id },
      data: {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || null,
        images: imagesArray,
        slug,
        published: data.published,
        publishedAt: data.published && !existingArticle.published ? new Date() : existingArticle.publishedAt,
        isFeatured: data.isFeatured ?? existingArticle.isFeatured,
        priority: data.priority ?? existingArticle.priority ?? 0,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update article' },
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
    const article = await prisma.news.update({
      where: { id: params.id },
      data: { images: imagesArray },
    });
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update article images' },
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

    await prisma.news.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
