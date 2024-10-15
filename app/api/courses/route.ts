import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';

// POST /api/courses
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { title } = await req.json();
    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const course = await db.course.create({ data: { title, userId } });

    return NextResponse.json(course);
  } catch (error) {
    console.log('[Courses] POST:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
