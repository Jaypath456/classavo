from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Course, Chapter, Enrollment
from .serializers import (
    CourseSerializer,
    ChapterSerializer, EnrollmentSerializer
)

# ─── Course Views ─────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def course_list(request):
    courses = Course.objects.filter(is_published=True)
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def instructor_courses(request):
    if request.user.role != 'instructor':
        return Response(
            {'error': 'Only instructors can view this'},
            status=status.HTTP_403_FORBIDDEN
        )

    courses = Course.objects.filter(instructor=request.user)
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def course_create(request):
    if request.user.role != 'instructor':
        return Response(
            {'error': 'Only instructors can create courses'},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = CourseSerializer(data=request.data)

    if serializer.is_valid():
        course = serializer.save(instructor=request.user)
        return Response(
            CourseSerializer(course).data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def course_detail(request, course_id):
    course = get_object_or_404(Course, id=course_id)

    if request.method == 'GET':
        return Response(CourseSerializer(course).data)

    if course.instructor != request.user:
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )

    if request.method == 'PUT':
        serializer = CourseSerializer(
            course,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    course.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chapter_list(request, course_id):
    course = get_object_or_404(Course, id=course_id)

    chapters = Chapter.objects.filter(course=course)
    serializer = ChapterSerializer(chapters, many=True)

    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chapter_create(request, course_id):
    course = get_object_or_404(Course, id=course_id)

    if course.instructor != request.user:
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = ChapterSerializer(data=request.data)

    if serializer.is_valid():
        chapter = serializer.save(course=course)
        return Response(
            ChapterSerializer(chapter).data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def chapter_detail(request, chapter_id):
    chapter = get_object_or_404(Chapter, id=chapter_id)

    if request.method == 'GET':
        return Response(ChapterSerializer(chapter).data)

    if chapter.course.instructor != request.user:
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )

    if request.method == 'PUT':
        serializer = ChapterSerializer(
            chapter,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    chapter.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll(request, course_id):
    course = get_object_or_404(Course, id=course_id)

    if Enrollment.objects.filter(
        student=request.user,
        course=course
    ).exists():
        return Response(
            {'error': 'Already enrolled'},
            status=status.HTTP_400_BAD_REQUEST
        )

    enrollment = Enrollment.objects.create(
        student=request.user,
        course=course
    )

    return Response(
        EnrollmentSerializer(enrollment).data,
        status=status.HTTP_201_CREATED
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_courses(request):
    enrollments = Enrollment.objects.filter(
        student=request.user
    )

    serializer = EnrollmentSerializer(
        enrollments,
        many=True
    )

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def enrollment_status(request, course_id):
    enrolled = Enrollment.objects.filter(
        student=request.user,
        course_id=course_id
    ).exists()

    return Response({'enrolled': enrolled})