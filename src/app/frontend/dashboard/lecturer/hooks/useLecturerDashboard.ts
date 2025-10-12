// src\app\frontend\dashboard\lecturer\hooks\useLecturerDashboard.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { LecturerStatsType, CategoryOptionType } from "../types/lecturer";
import { CourseType } from "../types/course";

export function useLecturerDashboard() {
  const [stats, setStats] = useState<LecturerStatsType | null>(null);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [categories, setCategories] = useState<CategoryOptionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      else setIsRefreshing(true);

      const res = await fetch("/api/dashboard/lecturer");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();

      setStats(data.stats);
      setCourses(data.courses || []);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      notifications.show({
        title: "Error",
        message: "Failed to load dashboard data",
        color: "red",
      });
    } finally {
      if (showLoader) setIsLoading(false);
      else setIsRefreshing(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/dashboard/lecturer/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const categoriesData = await response.json();
      setCategories(categoriesData);
    } catch {
      notifications.show({
        title: "Warning",
        message: "Failed to load categories. Using defaults.",
        color: "yellow",
      });
      setCategories([
        { value: "1", label: "Teknik Informatika & Ilmu Komputer" },
        { value: "2", label: "Jaringan Komputer" },
      ]);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchCategories();
  }, []);

  return {
    stats,
    courses,
    categories,
    isLoading,
    isRefreshing,
    error,
    setStats,
    setCourses,
    fetchDashboardData,
  };
}
