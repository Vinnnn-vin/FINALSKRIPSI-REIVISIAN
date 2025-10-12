/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src\app\frontend\dashboard\admin\page.tsx

"use client";

import {
  Container,
  Loader,
  Center,
  Text,
  Tabs,
  Modal,
  Button,
  Group,
} from "@mantine/core";
import { useAdminDashboard } from "./hooks/useAdminDashboard";
import DashboardHeader from "./components/DashboardHeader";
import OverviewTab from "./components/OverviewTab";
import UsersTab from "./components/UsersTab";
import CoursesTab from "./components/CoursesTab";
import EnrollmentsTab from "./components/EnrollmentsTab";
import PaymentsTab from "./components/PaymentsTab";
import AnalyticsTab from "./components/AnalyticsTab";
import UserModal from "./components/UserModal";
import DeleteUserModal from "./components/DeleteUserModal";
import CourseModal from "./components/CourseModal";

const DeleteCourseModal = ({
  courseToDelete,
  setCourseToDelete,
  handleCourseDelete,
}: any) => (
  <Modal
    opened={!!courseToDelete}
    onClose={() => setCourseToDelete(null)}
    title="Confirm Deletion"
    centered
  >
    <Text>
      Are you sure you want to delete the course "
      <strong>{courseToDelete?.course_title}</strong>"? This action cannot be
      undone.
    </Text>
    <Group justify="flex-end" mt="md">
      <Button variant="default" onClick={() => setCourseToDelete(null)}>
        Cancel
      </Button>
      <Button color="red" onClick={handleCourseDelete}>
        Delete Course
      </Button>
    </Group>
  </Modal>
);

const AdminDashboard = () => {
  const dashboard = useAdminDashboard();

  if (dashboard.loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!dashboard.stats) {
    return (
      <Center h="100vh">
        <Text c="red">Failed to load dashboard data</Text>
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      {/* === Header === */}
      <DashboardHeader
        refreshing={dashboard.refreshing}
        fetchDashboardData={dashboard.fetchDashboardData}
        exportData={dashboard.exportData}
      />

      {/* === Tabs === */}
      <Tabs
        defaultValue="overview"
        variant="pills"
        radius="md"
        keepMounted={false} // opsional: biar panel tidak render semua sekaligus
      >
        <Tabs.List mb="md">
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="users">Users</Tabs.Tab>
          <Tabs.Tab value="courses">Courses</Tabs.Tab>
          <Tabs.Tab value="enrollments">Enrollments</Tabs.Tab>
          <Tabs.Tab value="payments">Payments</Tabs.Tab>
          <Tabs.Tab value="analytics">Analytics</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="md">
          <OverviewTab
            stats={dashboard.stats}
            fetchDashboardData={dashboard.fetchDashboardData}
            setSelectedUser={dashboard.setSelectedUser}
            resetUserForm={dashboard.resetUserForm}
            setSelectedCourse={dashboard.setSelectedCourse}
          />
        </Tabs.Panel>

        <Tabs.Panel value="users" pt="md">
          <UsersTab
            users={dashboard.users}
            searchTerm={dashboard.searchTerm}
            setSearchTerm={dashboard.setSearchTerm}
            filterRole={dashboard.filterRole}
            setFilterRole={dashboard.setFilterRole}
            currentPage={dashboard.currentPage}
            setCurrentPage={dashboard.setCurrentPage}
            itemsPerPage={dashboard.itemsPerPage}
            handleUserEdit={dashboard.handleUserEdit}
            setUserToDelete={dashboard.setUserToDelete}
            resetUserPassword={dashboard.resetUserPassword}
            setSelectedUser={dashboard.setSelectedUser}
            resetUserForm={dashboard.resetUserForm}
          />
        </Tabs.Panel>

        <Tabs.Panel value="courses" pt="md">
          <CoursesTab
            courses={dashboard.courses}
            searchTerm={dashboard.searchTerm}
            setSearchTerm={dashboard.setSearchTerm}
            filterStatus={dashboard.filterStatus}
            setFilterStatus={dashboard.setFilterStatus}
            currentPage={dashboard.currentPage}
            setCurrentPage={dashboard.setCurrentPage}
            itemsPerPage={dashboard.itemsPerPage}
            handleCourseStatusToggle={dashboard.handleCourseStatusToggle}
            // setSelectedCourse={dashboard.setSelectedCourse}
            handleCourseEdit={dashboard.handleCourseEdit}
            setSelectedCourse={dashboard.setSelectedCourse}
            setCourseToDelete={dashboard.setCourseToDelete}
          />
        </Tabs.Panel>

        <Tabs.Panel value="enrollments" pt="md">
          <EnrollmentsTab
            enrollments={dashboard.enrollments}
            currentPage={dashboard.currentPage}
            setCurrentPage={dashboard.setCurrentPage}
            itemsPerPage={dashboard.itemsPerPage}
          />
        </Tabs.Panel>

        <Tabs.Panel value="payments" pt="md">
          <PaymentsTab
            payments={dashboard.payments}
            currentPage={dashboard.currentPage}
            setCurrentPage={dashboard.setCurrentPage}
            itemsPerPage={dashboard.itemsPerPage}
          />
        </Tabs.Panel>

        <Tabs.Panel value="analytics" pt="md">
          <AnalyticsTab stats={dashboard.stats} />
        </Tabs.Panel>
      </Tabs>

      {/* === Modals === */}
      <UserModal
        selectedUser={dashboard.selectedUser}
        setSelectedUser={dashboard.setSelectedUser}
        userFormData={dashboard.userFormData}
        setUserFormData={dashboard.setUserFormData}
        handleUserCreate={dashboard.handleUserCreate}
        handleUserSave={dashboard.handleUserSave}
        resetUserForm={dashboard.resetUserForm}
      />

      <DeleteUserModal
        userToDelete={dashboard.userToDelete}
        setUserToDelete={dashboard.setUserToDelete}
        handleUserDelete={dashboard.handleUserDelete}
      />

      <CourseModal
        lecturers={dashboard.lecturers}
        selectedCourse={dashboard.selectedCourse}
        setSelectedCourse={dashboard.setSelectedCourse}
        courseFormData={dashboard.courseFormData}
        setCourseFormData={dashboard.setCourseFormData}
        handleCourseSave={dashboard.handleCourseSave}
        // handleCourseCreate={dashboard.handleCourseCreate} // akan kita buat
        resetCourseForm={dashboard.resetCourseForm} // akan kita buat
      />

      <DeleteCourseModal
        courseToDelete={dashboard.courseToDelete}
        setCourseToDelete={dashboard.setCourseToDelete}
        handleCourseDelete={dashboard.handleCourseDelete}
      />
    </Container>
  );
};

export default AdminDashboard;
