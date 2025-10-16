// src\app\frontend\dashboard\student\page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { Container, Stack } from "@mantine/core";
import { DashboardHeader } from "./features/dashboard-overview/components/DashboardHeader";
import StatsCards from "./features/dashboard-overview/components/StatsCards";
import { SearchFilters } from "./features/dashboard-overview/components/SearchFilters";
import TabContent from "./features/dashboard-overview/components/TabContent";
import { LoadingState, ErrorState } from "./shared/components/StateDisplays";
import { useDashboardStore } from "./features/dashboard-overview/stores/useDashboardStore";
import { ReviewModal } from "./features/review/components/ReviewModal";
import { CertificateModal } from "./features/certificate/components/CertificateModal";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

export default function DashboardStudentPage() {
  const {
    loading,
    error,
    dashboardData,
    enrolledCourses,
    availableCourses,
    inProgressCourses,
    activeTab,
    searchTerm,
    filterLevel,
    sortBy,
    sortOrder,
    hasActiveFilters,
    fetchDashboardData,
    handleClearFilters,
    setActiveTab,
    setSearchTerm,
    setFilterLevel,
    setSortBy,
    setSortOrder,
  } = useDashboardStore();

  const [certificateModalOpened, certificateModalHandlers] =
    useDisclosure(false);
  const [reviewModalOpened, reviewModalHandlers] = useDisclosure(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<
    number | null
  >(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleOpenCertificateModal = (courseId: number) => {
    const enrollment = enrolledCourses.find(
      (e: any) => e.course.course_id === courseId
    );

    if (enrollment) {
      setSelectedEnrollmentId(enrollment.enrollment_id);
      setSelectedCourseId(courseId);
      certificateModalHandlers.open();
    }
  };

  const handleReviewClose = () => {
    reviewModalHandlers.close();
    fetchDashboardData();
  };

  if (loading) return <LoadingState message="Loading your dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={fetchDashboardData} />;
  if (!dashboardData)
    return <ErrorState message="No dashboard data available" />;

  const { user, stats } = dashboardData;
  const completionRate =
    stats.totalEnrolled > 0
      ? Math.round((stats.totalCompleted / stats.totalEnrolled) * 100)
      : 0;

  return (
    <>
      <CertificateModal
        opened={certificateModalOpened}
        onClose={certificateModalHandlers.close}
        enrollmentId={selectedEnrollmentId}
        courseId={selectedCourseId}
      />

      <ReviewModal
        opened={reviewModalOpened}
        onClose={handleReviewClose}
        courseId={selectedCourseId}
      />

      <Container size="xl" py="md">
        <Stack gap="lg">
          <DashboardHeader
            userName={
              `${user.first_name} ${user.last_name}`.trim() || "Student"
            }
            onRefresh={fetchDashboardData}
            onLogout={() => (window.location.href = "/api/auth/signout")}
          />

          <StatsCards
            totalEnrolled={stats.totalEnrolled}
            totalCompleted={stats.totalCompleted}
            totalCertificates={stats.totalCertificates}
            inProgressCount={inProgressCourses.length}
            completionRate={completionRate}
          />

          <SearchFilters
            searchTerm={searchTerm}
            filterLevel={filterLevel}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSearchChange={setSearchTerm}
            onLevelChange={setFilterLevel}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          <TabContent
            activeTab={activeTab}
            onTabChange={setActiveTab}
            enrolledCourses={enrolledCourses}
            availableCourses={availableCourses}
            inProgressCourses={inProgressCourses}
            onViewCertificate={handleOpenCertificateModal}
            onClearFilters={handleClearFilters}
            onRefresh={fetchDashboardData}
            searchTerm={searchTerm}
            hasActiveFilters={hasActiveFilters}
          />
        </Stack>
      </Container>
    </>
  );
}
