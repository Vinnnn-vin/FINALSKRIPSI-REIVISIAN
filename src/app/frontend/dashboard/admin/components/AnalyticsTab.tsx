// src\app\frontend\dashboard\admin\components\AnalyticsTab.tsx
"use client";

import {
  Card,
  Grid,
  Text,
  RingProgress,
  Title,
  Stack,
} from "@mantine/core";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { DashboardStats } from "../types/dashboard";

interface Props {
  stats: DashboardStats;
}

const AnalyticsTab = ({ stats }: Props) => {
  return (
    <Stack>
      {/* === KPI Metrics === */}
      <Card shadow="sm" p="lg" radius="md" mb="lg">
        <Title order={4} mb="md">
          KPI Metrics
        </Title>
        <Grid>
          <Grid.Col span={3}>
            <RingProgress
              size={120}
              thickness={12}
              sections={[
                { value: stats.totalCourses, color: "blue" },
              ]}
              label={
                <Text ta="center" size="sm">
                  Courses
                  <br />
                  {stats.totalCourses}
                </Text>
              }
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <RingProgress
              size={120}
              thickness={12}
              sections={[
                { value: stats.publishedCourses, color: "green" },
              ]}
              label={
                <Text ta="center" size="sm">
                  Published
                  <br />
                  {stats.publishedCourses}
                </Text>
              }
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <RingProgress
              size={120}
              thickness={12}
              sections={[
                { value: stats.unpublishedCourses, color: "red" },
              ]}
              label={
                <Text ta="center" size="sm">
                  Unpublished
                  <br />
                  {stats.unpublishedCourses}
                </Text>
              }
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <RingProgress
              size={120}
              thickness={12}
              sections={[
                { value: stats.recentEnrollments, color: "orange" },
              ]}
              label={
                <Text ta="center" size="sm">
                  Recent Enrollments
                  <br />
                  {stats.recentEnrollments}
                </Text>
              }
            />
          </Grid.Col>
        </Grid>
      </Card>

      {/* === Category Analytics === */}
      <Card shadow="sm" p="lg" radius="md" mb="lg">
        <Title order={4} mb="md">
          Category Analytics
        </Title>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.categoryAnalytics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category_name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="course_count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Stack>
  );
};

export default AnalyticsTab;
