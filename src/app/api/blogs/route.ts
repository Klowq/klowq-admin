import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getBlogs, createBlog } from '@/lib/storage';
import { CreateBlogDto } from '@/types/blog';

// GET /api/blogs - Get all blogs
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const blogs = await getBlogs();
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: CreateBlogDto = await request.json();
    
    if (!body.title || !body.content || !body.author) {
      return NextResponse.json(
        { error: 'Title, content, and author are required' },
        { status: 400 }
      );
    }

    const newBlog = await createBlog({
      title: body.title,
      content: body.content,
      author: body.author,
      bannerImage: body.bannerImage,
      featured: body.featured || false,
      featuredDoctorId: body.featuredDoctorId,
      preferences: body.preferences || [],
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}

