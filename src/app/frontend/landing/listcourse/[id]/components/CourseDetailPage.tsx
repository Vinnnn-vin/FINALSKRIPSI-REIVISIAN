// src\app\frontend\landing\listcourse\[id]\components\CourseDetailPage.tsx
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Container, Grid, GridCol, Box, Loader, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { CourseHero } from "./CourseHero";
import { CourseSidebar } from "./CourseSidebar";
import { CourseContent } from "./CourseContent";
import { ApiResponse } from "@/types";

interface CourseDetailPageProps {
  params: {
    id: string;
  };
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ params }) => {
  const [courseData, setCourseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/landing/listcourse/${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse<any> = await response.json();

        if (result.success && result.data) {
          setCourseData(result.data);
        } else {
          throw new Error(result.error || "Failed to fetch course data");
        }
      } catch (err) {
        console.error("Error fetching course detail:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCourseDetail();
    }
  }, [params.id]);

  if (loading) {
    return (
      <Box 
        style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "60vh" 
        }}
      >
        <Loader size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Container size="md" py={50}>
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error Loading Course"
          color="red"
          variant="filled"
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!courseData) {
    return (
      <Container size="md" py={50}>
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Course Not Found"
          color="orange"
          variant="filled"
        >
          The course you're looking for could not be found.
        </Alert>
      </Container>
    );
  }

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Box>
      <CourseHero courseData={courseData} />

      <Container size="xl" py={50}>
        <Grid>
          <GridCol span={{ base: 12, md: 8 }}>
            <CourseContent 
              courseData={courseData}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </GridCol>

          <GridCol span={{ base: 12, md: 4 }}>
            <CourseSidebar 
              courseData={courseData}
              isWishlisted={isWishlisted}
              onWishlistToggle={handleWishlistToggle}
            />
          </GridCol>
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseDetailPage;