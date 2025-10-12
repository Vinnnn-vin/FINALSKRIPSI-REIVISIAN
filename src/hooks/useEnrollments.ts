/* eslint-disable @typescript-eslint/no-unused-vars */
// File: hooks/useEnrollments.ts
// ================================
import { useEnrollmentStore } from '@/stores/enrollmentStore';
import { useCallback, useEffect } from 'react';
import { notifications } from '@mantine/notifications';

export const useEnrollments = () => {
  const {
    enrolledCourses,
    inProgressCourses,
    completedCourses,
    isLoading,
    error,
    fetchEnrolledCourses,
    enrollInCourse,
    markCourseComplete,
    fetchCourseEnrollments,
    clearError,
  } = useEnrollmentStore();

  const handleEnrollInCourse = useCallback(async (courseId: number) => {
    try {
      await enrollInCourse(courseId);
      notifications.show({
        title: 'Success',
        message: 'Successfully enrolled in course!',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to enroll in course',
        color: 'red',
      });
    }
  }, [enrollInCourse]);

  const handleMarkComplete = useCallback(async (enrollmentId: number) => {
    try {
      await markCourseComplete(enrollmentId);
      notifications.show({
        title: 'Congratulations!',
        message: 'Course marked as complete!',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to mark course as complete',
        color: 'red',
      });
    }
  }, [markCourseComplete]);

  return {
    enrolledCourses,
    inProgressCourses,
    completedCourses,
    isLoading,
    error,
    loadEnrollments: fetchEnrolledCourses,
    enrollInCourse: handleEnrollInCourse,
    markCourseComplete: handleMarkComplete,
    loadCourseEnrollments: fetchCourseEnrollments,
    clearError,
  };
};
