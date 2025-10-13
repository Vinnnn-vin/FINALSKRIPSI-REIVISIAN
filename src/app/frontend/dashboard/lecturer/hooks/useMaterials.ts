// src\app\frontend\dashboard\lecturer\hooks\useMaterials.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { notifications } from "@mantine/notifications";
import { MaterialType } from "../types/material";

export function useMaterials(courseId: string) {
  const [courseTitle, setCourseTitle] = useState("");
  const [materials, setMaterials] = useState<MaterialType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterials = useCallback(async () => {
    try {
      const res = await fetch(`/api/dashboard/lecturer/materi/${courseId}`);
      if (!res.ok) throw new Error("Failed to fetch materials");
      const data = await res.json();
      setCourseTitle(data.courseTitle);
      setMaterials(data.materials);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  const updateMaterial = (updated: MaterialType) => {
    setMaterials((prev) =>
      prev.map((m) => (m.material_id === updated.material_id ? updated : m))
    );
  };

  const deleteMaterial = (id: number) => {
    setMaterials((prev) => prev.filter((m) => m.material_id !== id));
    notifications.show({
      title: "Success",
      message: "Material deleted successfully",
      color: "green",
    });
  };

  useEffect(() => {
    if (courseId) fetchMaterials();
  }, [courseId, fetchMaterials]); // ✅ sekarang aman

  return {
    courseTitle,
    materials,
    isLoading,
    error,
    setMaterials,
    updateMaterial,
    deleteMaterial,
    fetchMaterials,
  };
}
