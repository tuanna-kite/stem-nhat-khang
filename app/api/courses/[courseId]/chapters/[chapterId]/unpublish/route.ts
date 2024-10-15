import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId, chapterId } = params;

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const ownCourse = await db.course.findFirst({
      where: {
        id: courseId,
        userId,
      },
    });
    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const unpublishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: false,
      },
    });

    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });
    if (publishedChapters.length === 0) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.log(error);
    return new NextResponse('An error occurred. Please try again.', { status: 500 });
  }
}
