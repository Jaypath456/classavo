from rest_framework import serializers
from .models import Course, Chapter, Enrollment
from users.serializers import UserSerializer


class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = [
            'id',
            'title',
            'content',
            'visibility',
            'order_index'
        ]


class CourseSerializer(serializers.ModelSerializer):
    instructor = UserSerializer(read_only=True)

    class Meta:
        model = Course
        fields = [
            'id',
            'title',
            'description',
            'instructor',
            'is_published'
        ]


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            'id',
            'course'
        ]