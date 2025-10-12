// src\app\frontend\dashboard\student\page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Container, Stack } from "@mantine/core";
import { DashboardHeader } from "./components/DashboardHeader";
import StatsCards from "./components/StatsCards";
import { SearchFilters } from "./components/SearchFilters";
import TabContent from "./components/TabContent";
import { LoadingState, ErrorState } from "./components/StateDisplays";
import { useDashboardStore } from "./stores/useDashboardStore";
import { ReviewModal } from "./components/ReviewModal";
import { CertificateModal } from "./components/CertificateModal";

export default function DashboardStudentPage() {
  const loading = useDashboardStore((s) => s.loading);
  const error = useDashboardStore((s) => s.error);
  const dashboardData = useDashboardStore((s) => s.dashboardData);
  const enrolledCourses = useDashboardStore((s) => s.enrolledCourses);
  const availableCourses = useDashboardStore((s) => s.availableCourses);
  const inProgressCourses = useDashboardStore((s) => s.inProgressCourses);
  const activeTab = useDashboardStore((s) => s.activeTab);
  const searchTerm = useDashboardStore((s) => s.searchTerm);
  const filterLevel = useDashboardStore((s) => s.filterLevel);
  const sortBy = useDashboardStore((s) => s.sortBy);
  const sortOrder = useDashboardStore((s) => s.sortOrder);
  const hasActiveFilters = useDashboardStore((s) => s.hasActiveFilters);

  const fetchDashboardData = useDashboardStore((s) => s.fetchDashboardData);
  const handleClearFilters = useDashboardStore((s) => s.handleClearFilters);
  const setActiveTab = useDashboardStore((s) => s.setActiveTab);
  const setSearchTerm = useDashboardStore((s) => s.setSearchTerm);
  const setFilterLevel = useDashboardStore((s) => s.setFilterLevel);
  const setSortBy = useDashboardStore((s) => s.setSortBy);
  const setSortOrder = useDashboardStore((s) => s.setSortOrder);

  // Certificate Modal State
  const [
    certificateModalOpened,
    { open: openCertificateModal, close: closeCertificateModal },
  ] = useDisclosure(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  // Review Modal State
  const [
    reviewModalOpened,
    { open: openReviewModal, close: closeReviewModal },
  ] = useDisclosure(false);

  // Handler untuk membuka certificate modal
  const handleOpenCertificateModal = (courseId: number) => {
    // Cari enrollment berdasarkan courseId
    const enrollment = enrolledCourses.find(
      (e: any) => e.course.course_id === courseId
    );
    
    if (enrollment) {
      setSelectedEnrollmentId(enrollment.enrollment_id);
      setSelectedCourseId(courseId);
      openCertificateModal();
    }
  };

  // Handler untuk membuka review modal dari certificate modal
  const handleOpenReviewFromCertificate = () => {
    openReviewModal();
  };

  // Handler ketika review modal ditutup - refresh data
  const handleReviewClose = () => {
    closeReviewModal();
    fetchDashboardData(); // Refresh untuk update status has_reviewed
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return <LoadingState message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={fetchDashboardData}
        onGoHome={() => (window.location.href = "/")}
      />
    );
  }

  if (!dashboardData) {
    return (
      <ErrorState
        message="No dashboard data available"
        onRetry={fetchDashboardData}
        onGoHome={() => (window.location.href = "/")}
      />
    );
  }

  const { user, stats } = dashboardData;
  const completionRate =
    stats.totalEnrolled > 0
      ? Math.round((stats.totalCompleted / stats.totalEnrolled) * 100)
      : 0;

  return (
    <>
      {/* Certificate Modal */}
      <CertificateModal
        opened={certificateModalOpened}
        onClose={closeCertificateModal}
        enrollmentId={selectedEnrollmentId}
        courseId={selectedCourseId}
      />

      {/* Review Modal */}
      <ReviewModal
        opened={reviewModalOpened}
        onClose={handleReviewClose}
        courseId={selectedCourseId}
      />

      <Container size="xl" py="md">
        <Stack gap="lg">
          {/* Header */}
          <DashboardHeader
            userName={
              `${user.first_name} ${user.last_name}`.trim() || "Student"
            }
            onRefresh={fetchDashboardData}
            onLogout={() => (window.location.href = "/api/auth/signout")}
          />

          {/* Stats Cards */}
          <StatsCards
            totalEnrolled={stats.totalEnrolled}
            totalCompleted={stats.totalCompleted}
            totalCertificates={stats.totalCertificates}
            inProgressCount={inProgressCourses.length}
            completionRate={completionRate}
          />

          {/* Search & Filters */}
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

          {/* Tabs Content */}
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