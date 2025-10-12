// src\app\frontend\dashboard\admin\hooks\useAdminDashboard.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import {
  DashboardStats,
  User,
  Course,
  Payment,
  EnrollmentData,
} from "../types/dashboard";
import { notifications } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconKey,
  IconInfoCircle,
  IconDownload,
} from "@tabler/icons-react";
import { exportToCSV } from "../utils/exportUtils";

interface LecturerOption {
  value: string;
  label: string;
}

export const useAdminDashboard = () => {
  // === State ===
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [lecturers, setLecturers] = useState<LecturerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modals state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const [userFormData, setUserFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    password: "",
  });

  const [courseFormData, setCourseFormData] = useState({
    course_title: "",
    course_description: "",
    course_level: "beginner",
    course_price: 0,
    user_id: 0,
    publish_status: 0,
    category_id: 1,
  });

  // === API Fetch ===
  const fetchDashboardData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      else setRefreshing(true);

      const [statsRes, usersRes, coursesRes, paymentsRes, enrollmentsRes] =
        await Promise.all([
          fetch("/api/dashboard/admin/stats"),
          fetch("/api/dashboard/admin/users"),
          fetch("/api/dashboard/admin/courses"),
          fetch("/api/dashboard/admin/payment"),
          fetch("/api/dashboard/admin/enrollments"),
        ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (coursesRes.ok) setCourses(await coursesRes.json());
      if (paymentsRes.ok) {
        const data = await paymentsRes.json();
        setPayments(data.payments || []);
      }
      if (enrollmentsRes.ok) {
        const data = await enrollmentsRes.json();
        setEnrollments(data.enrollments || []);
      }
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to fetch dashboard data",
        color: "red",
        icon: <IconAlertTriangle size={16} />,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchLecturers = async () => {
    try {
      const res = await fetch("/api/dashboard/admin/lecturers");
      if (res.ok) {
        setLecturers(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch lecturers");
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchLecturers();
  }, []);

  // === Handlers ===
  const handleCourseEdit = (course: Course) => {
    setSelectedCourse(course);
    setCourseFormData({
      course_title: course.course_title,
      course_description: course.course_description,
      course_level: course.course_level,
      course_price: course.course_price,
      user_id: course.user_id,
      publish_status: course.publish_status,
      category_id: course.category_id,
    });
  };

  const handleCourseSave = async () => {
    try {
      if (!selectedCourse) return;
      const isEdit = selectedCourse.course_id;
      const url = isEdit
        ? `/api/dashboard/admin/courses/${selectedCourse.course_id}`
        : "/api/dashboard/admin/courses";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseFormData),
      });

      if (response.ok) {
        notifications.show({
          title: "Success",
          message: `Course ${isEdit ? "updated" : "created"} successfully`,
          color: "green",
          icon: <IconCheck size={16} />,
        });
        fetchDashboardData(false);
        setSelectedCourse(null);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to ${isEdit ? "update" : "create"} course`
        );
      }
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
        icon: <IconX size={16} />,
      });
    }
  };

  const handleCourseDelete = async () => {
    if (!courseToDelete) return;
    try {
      const response = await fetch(
        `/api/dashboard/admin/courses/${courseToDelete.course_id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        notifications.show({
          title: "Success",
          message: "Course deleted successfully",
          color: "green",
        });
        fetchDashboardData(false);
        setCourseToDelete(null);
      } else {
        throw new Error("Failed to delete course");
      }
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    }
  };

  const resetCourseForm = () => {
    setCourseFormData({
      course_title: "",
      course_description: "",
      course_level: "beginner",
      course_price: 0,
      user_id: 0,
      publish_status: 0,
      category_id: 1,
    });
  };

  const handleUserEdit = (user: User) => {
    setSelectedUser(user);
    setUserFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      password: "",
    });
  };

  const handleUserSave = async () => {
    try {
      if (!selectedUser) return;

      const response = await fetch(
        `/api/dashboard/admin/users/${selectedUser.user_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: userFormData.first_name,
            last_name: userFormData.last_name,
            email: userFormData.email,
            role: userFormData.role,
          }),
        }
      );

      if (response.ok) {
        notifications.show({
          title: "Success",
          message: "User updated successfully",
          color: "green",
          icon: <IconCheck size={16} />,
        });
        fetchDashboardData(false);
        setSelectedUser(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user");
      }
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to update user",
        color: "red",
        icon: <IconX size={16} />,
      });
    }
  };

  const handleUserCreate = async () => {
    try {
      if (
        !userFormData.first_name ||
        !userFormData.last_name ||
        !userFormData.email ||
        !userFormData.role ||
        !userFormData.password
      ) {
        notifications.show({
          title: "Validation Error",
          message: "Please fill in all required fields",
          color: "red",
          icon: <IconAlertTriangle size={16} />,
        });
        return;
      }

      const response = await fetch("/api/dashboard/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userFormData),
      });

      if (response.ok) {
        notifications.show({
          title: "Success",
          message: "User created successfully",
          color: "green",
          icon: <IconCheck size={16} />,
        });
        fetchDashboardData(false);
        resetUserForm();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to create user");
      }
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to create user",
        color: "red",
        icon: <IconX size={16} />,
      });
    }
  };

  // const handleCourseStatusToggle = async (
  //   courseId: number,
  //   currentStatus: number
  // ) => {
  //   try {
  //     const response = await fetch(
  //       `/api/dashboard/admin/courses/${courseId}/status`,
  //       {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ publish_status: currentStatus === 1 ? 0 : 1 }),
  //       }
  //     );

  //     if (response.ok) {
  //       notifications.show({
  //         title: "Success",
  //         message: "Course status updated successfully",
  //         color: "green",
  //         icon: <IconCheck size={16} />,
  //       });
  //       fetchDashboardData(false);
  //     } else {
  //       throw new Error("Failed to update course status");
  //     }
  //   } catch {
  //     notifications.show({
  //       title: "Error",
  //       message: "Failed to update course status",
  //       color: "red",
  //       icon: <IconX size={16} />,
  //     });
  //   }
  // };

  const handleCourseStatusToggle = async (
    courseId: number,
    currentStatus: number
  ) => {
    const courseToToggle = courses.find((c) => c.course_id === courseId);

    // [!] Skenario Pengecekan Harga
    if (
      currentStatus === 0 &&
      (!courseToToggle || courseToToggle.course_price <= 0)
    ) {
      notifications.show({
        title: "Action Blocked",
        message: "You must set a price for the course before publishing it.",
        color: "orange",
        icon: <IconAlertTriangle size={16} />,
      });
      return;
    }

    try {
      const response = await fetch(
        `/api/dashboard/admin/courses/${courseId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publish_status: currentStatus === 1 ? 0 : 1 }),
        }
      );
      if (response.ok) {
        notifications.show({
          title: "Success",
          message: "Course status updated successfully",
          color: "green",
          icon: <IconCheck size={16} />,
        });
        fetchDashboardData(false);
      } else {
        throw new Error("Failed to update course status");
      }
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to update course status",
        color: "red",
        icon: <IconX size={16} />,
      });
    }
  };

  const resetUserPassword = async (userId: number) => {
    try {
      const response = await fetch(
        `/api/dashboard/admin/users/${userId}/reset-password`,
        { method: "POST" }
      );

      if (response.ok) {
        const data = await response.json();
        notifications.show({
          title: "Password Reset Successful",
          message: `Temporary password: ${data.tempPassword}. Please inform the user.`,
          color: "green",
          autoClose: 15000,
          icon: <IconKey size={16} />,
        });
      } else {
        throw new Error("Failed to reset password");
      }
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to reset password",
        color: "red",
        icon: <IconX size={16} />,
      });
    }
  };

  const handleUserDelete = async () => {
    try {
      if (!userToDelete) return;

      const response = await fetch(
        `/api/dashboard/admin/users/${userToDelete.user_id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        notifications.show({
          title: "Success",
          message: "User deleted successfully",
          color: "green",
          icon: <IconCheck size={16} />,
        });
        fetchDashboardData(false);
        setUserToDelete(null);
      } else {
        throw new Error("Failed to delete user");
      }
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete user",
        color: "red",
        icon: <IconX size={16} />,
      });
    }
  };

  const resetUserForm = () => {
    setUserFormData({
      first_name: "",
      last_name: "",
      email: "",
      role: "",
      password: "",
    });
  };

  const exportData = (type: string) => {
    let data: any[] = [];
    let filename = "";

    switch (type) {
      case "users":
        data = users;
        filename = "users_export.csv";
        break;
      case "courses":
        data = courses;
        filename = "courses_export.csv";
        break;
      case "enrollments":
        data = enrollments;
        filename = "enrollments_export.csv";
        break;
      default:
        return;
    }

    if (data.length === 0) {
      notifications.show({
        title: "No Data",
        message: "No data available to export",
        color: "yellow",
        icon: <IconInfoCircle size={16} />,
      });
      return;
    }

    // [!] Panggil fungsi ekspor di sini
    try {
      exportToCSV(data, filename);
      notifications.show({
        title: "Export Successful",
        message: `${data.length} records have been exported to ${filename}.`,
        color: "green",
        icon: <IconDownload size={16} />,
      });
    } catch (error) {
      notifications.show({
        title: "Export Failed",
        message: "An error occurred while exporting the data.",
        color: "red",
      });
      console.error("Export error:", error);
    }
  };

  // === Return ===
  return {
    stats,
    users,
    courses,
    payments,
    enrollments,
    lecturers,
    loading,
    refreshing,
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    selectedUser,
    setSelectedUser,
    userToDelete,
    setUserToDelete,
    selectedCourse,
    setSelectedCourse,
    userFormData,
    setUserFormData,
    courseFormData,
    setCourseFormData,
    fetchDashboardData,
    handleUserEdit,
    handleUserSave,
    handleUserCreate,
    handleCourseStatusToggle,
    resetUserPassword,
    handleUserDelete,
    resetUserForm,
    exportData,
    handleCourseEdit,
    handleCourseSave,
    handleCourseDelete,
    resetCourseForm,
    courseToDelete,
    setCourseToDelete,
  };
};
