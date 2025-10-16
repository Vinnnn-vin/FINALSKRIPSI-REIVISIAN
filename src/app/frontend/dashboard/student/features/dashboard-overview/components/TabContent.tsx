// src/app/frontend/dashboard/student/components/TabContent.tsx
// src\app\frontend\dashboard\student\features\dashboard-overview\components\TabContent.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Tabs, SimpleGrid, Grid, Stack, Title, Card, Text } from '@mantine/core';
import { EnrolledCourseCard } from '../../../components/EnrolledCourseCard';
import { AvailableCourseCard } from '../../../components/AvailableCourseCard';

export default function TabContent({
  activeTab,
  onTabChange,
  enrolledCourses,
  availableCourses,
  inProgressCourses,
  onViewCertificate,
  onWriteReview
}: any) {
  const recentInProgress = (inProgressCourses || []).slice(0, 2);
  const availableForOverview = (availableCourses || []).slice(0, 2);

  return (
    <Tabs value={activeTab} onChange={onTabChange} variant="pills" radius="md">
      <Tabs.List>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="enrolled">Enrolled ({enrolledCourses?.length || 0})</Tabs.Tab>
        <Tabs.Tab value="inProgress">In Progress ({inProgressCourses?.length || 0})</Tabs.Tab>
        <Tabs.Tab value="available">Available ({availableCourses?.length || 0})</Tabs.Tab>
      </Tabs.List>

      {/* === TAB OVERVIEW === */}
      <Tabs.Panel value="overview" pt="lg">
        <Grid>
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack>
              <Title order={3}>Continue Learning</Title>
              {recentInProgress.length > 0 ? (
                recentInProgress.map((course: any) => (
                  // [!] PERBAIKAN: Teruskan prop onViewCertificate yang benar
                  <EnrolledCourseCard 
                    key={course.enrollment_id} 
                    course={course} 
                    onViewCertificate={onViewCertificate}
                    onWriteReview={onWriteReview}
                  />
                ))
              ) : (
                <Card withBorder p="xl"><Text c="dimmed">No courses in progress. Start a new one!</Text></Card>
              )}
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack>
              <Title order={3}>Available Courses</Title>
              {availableForOverview.length > 0 ? (
                availableForOverview.map((course: any) => (
                  <AvailableCourseCard
                    key={course.course_id}
                    course={course}
                  />
                ))
              ) : (
                <Card withBorder p="xl"><Text c="dimmed">No new courses available.</Text></Card>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </Tabs.Panel>

      {/* === TAB ENROLLED === */}
      <Tabs.Panel value="enrolled" pt="lg">
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {(enrolledCourses || []).map((course: any) => (
            <EnrolledCourseCard 
              key={course.enrollment_id} 
              course={course} 
              onViewCertificate={onViewCertificate} 
              onWriteReview={onWriteReview}
            />
          ))}
        </SimpleGrid>
      </Tabs.Panel>

      {/* === TAB IN PROGRESS === */}
      <Tabs.Panel value="inProgress" pt="lg">
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {(inProgressCourses || []).map((course: any) => (
            // [!] PERBAIKAN: Teruskan prop onViewCertificate yang benar
            <EnrolledCourseCard 
              key={course.enrollment_id} 
              course={course} 
              onViewCertificate={onViewCertificate}
              onWriteReview={onWriteReview}
            />
          ))}
        </SimpleGrid>
      </Tabs.Panel>

      {/* === TAB AVAILABLE === */}
      <Tabs.Panel value="available" pt="lg">
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {(availableCourses || []).map((course: any) => (
            <AvailableCourseCard
              key={course.course_id}
              course={course}
            />
          ))}
        </SimpleGrid>
      </Tabs.Panel>
    </Tabs>
  );
}