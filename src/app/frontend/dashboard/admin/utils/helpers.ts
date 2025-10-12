// src\app\frontend\dashboard\admin\utils\helpers.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Course } from "../types/dashboard";

export const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
    case "completed":
    case "paid":
    case "published":
      return "green";
    case "pending":
    case "enrolled":
      return "yellow";
    case "failed":
    case "cancelled":
      return "red";
    case "suspended":
    case "dropped":
      return "orange";
    default:
      return "gray";
  }
};

export const getInstructorName = (course: Course) => {
  if (course.instructor) {
    return `${course.instructor.first_name} ${course.instructor.last_name}`;
  }
  if (course.User) {
    return `${course.User.first_name} ${course.User.last_name}`;
  }
  return "Unassigned";
};

export const getCategoryName = (course: Course) => {
  if (course.category) {
    return course.category.category_name;
  }
  if (course.Category) {
    return course.Category.category_name;
  }
  return "Uncategorized";
};

export const getUserName = (user: any) => {
  if (user?.first_name && user?.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  return "Unknown User";
};
