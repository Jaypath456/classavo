from rest_framework.permissions import BasePermission


class IsInstructor(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == 'instructor'
        )


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == 'student'
        )


class IsCourseInstructor(BasePermission):
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'instructor'):
            return obj.instructor == request.user

        if hasattr(obj, 'course'):
            return obj.course.instructor == request.user

        return False