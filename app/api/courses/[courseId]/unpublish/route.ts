import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();
    const { courseId } = params;

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    const unpublishedCourse = await db.course.update({
      where: { id: courseId, userId },
      data: { isPublished: false },
    });
    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.log('[Course_ID] PUBLISH:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
