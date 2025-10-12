// src\app\frontend\dashboard\admin\components\OverviewTab.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Grid,
  Text as MantineText,
  Group,
  Button,
  RingProgress,
  Stack,
  Title,
  Paper,
  Box,
  rem,
} from "@mantine/core";
import {
  IconUsers,
  IconBook,
  IconChalkboard,
  IconClipboardList,
  IconUserPlus,
  IconPlus,
  IconRefresh,
} from "@tabler/icons-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DashboardStats } from "../types/dashboard";
import React from "react";

interface Props {
  stats: DashboardStats;
  fetchDashboardData: () => void;
  setSelectedUser: (user: any) => void;
  resetUserForm: () => void;
  setSelectedCourse: (course: any) => void;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#845EC2"];

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactElement;
  color?: string;
  trend?: string | null;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color = "blue",
  trend = null,
}) => {
  return (
    <Paper
      shadow="xs"
      p="xl"
      radius="lg"
      style={{
        background: `linear-gradient(135deg, ${
          color === "blue"
            ? "#667eea 0%, #764ba2 100%"
            : color === "green"
            ? "#11998e 0%, #38ef7d 100%"
            : color === "orange"
            ? "#f093fb 0%, #f5576c 100%"
            : "#4facfe 0%, #00f2fe 100%"
        })`,
        color: "white",
        border: "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          opacity: 0.1,
        }}
      >
        {React.cloneElement(icon)}
      </Box>
      <Group justify="space-between" align="flex-start">
        <Box>
          <MantineText
            size="sm"
            style={{ color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}
          >
            {title}
          </MantineText>
          <MantineText
            fw={700}
            size="xl"
            style={{ fontSize: "2rem", marginBottom: "4px" }}
          >
            {value.toLocaleString()}
          </MantineText>
          {trend && (
            <MantineText size="xs" style={{ color: "rgba(255,255,255,0.9)" }}>
              {trend}
            </MantineText>
          )}
        </Box>
        <Box style={{ color: "rgba(255,255,255,0.9)" }}>
          {React.cloneElement(icon)}
        </Box>
      </Group>
    </Paper>
  );
};

const OverviewTab: React.FC<Props> = ({
  stats = {
    totalCourses: 0,
    totalStudents: 0,
    totalLecturers: 0,
    totalEnrollments: 0,
    publishedCourses: 0,
    unpublishedCourses: 0,
    recentEnrollments: 0,
    categoryAnalytics: [],
    enrollmentTrends: [],
    paymentSummary: [],
  },
  fetchDashboardData = () => {},
  setSelectedUser = () => {},
  resetUserForm = () => {},
  setSelectedCourse = () => {},
}) => {
  return (
    <Stack gap="xl">
      {/* Stats Cards */}
      <Grid>
        <Grid.Col span={3}>
          <StatsCard
            title="Total Courses"
            value={stats.totalCourses}
            icon={<IconBook />}
            color="blue"
            trend="+12% from last month"
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <StatsCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<IconUsers />}
            color="green"
            trend="+8% from last month"
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <StatsCard
            title="Total Lecturers"
            value={stats.totalLecturers}
            icon={<IconChalkboard />}
            color="orange"
            trend="+5% from last month"
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <StatsCard
            title="Total Enrollments"
            value={stats.totalEnrollments}
            icon={<IconClipboardList />}
            color="purple"
            trend="+15% from last month"
          />
        </Grid.Col>
      </Grid>

      {/* Enrollment Trends Chart */}
      <Paper
        shadow="xs"
        p="xl"
        radius="lg"
        style={{ border: "1px solid #e9ecef" }}
      >
        <Title order={3} fw={600} c="dark.8" mb="xl">
          Enrollment Trends
        </Title>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={stats.enrollmentTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="enrollments"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Paper>

      {/* Course Status Overview and Category Distribution */}
      <Grid>
        <Grid.Col span={6}>
          <Paper
            shadow="xs"
            p="xl"
            radius="lg"
            style={{ border: "1px solid #e9ecef", height: "100%" }}
          >
            <Title order={3} fw={600} c="dark.8" mb="xl">
              Course Status Overview
            </Title>
            <Stack gap="lg">
              <Group justify="center">
                <RingProgress
                  size={160}
                  thickness={20}
                  sections={[
                    {
                      value:
                        stats.totalCourses > 0
                          ? (stats.publishedCourses / stats.totalCourses) * 100
                          : 0,
                      color: "teal",
                    },
                  ]}
                  label={
                    <MantineText ta="center" fw={600} size="md">
                      Courses
                      <br />
                      <MantineText component="span" size="xl" color="blue">
                        {stats.totalCourses}
                      </MantineText>
                    </MantineText>
                  }
                />
              </Group>

              <Grid>
                <Grid.Col span={6}>
                  <Paper
                    p="md"
                    radius="md"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <Group justify="center">
                      <Box ta="center">
                        <MantineText size="lg" fw={600} color="red">
                          {stats.unpublishedCourses}
                        </MantineText>
                        <MantineText size="sm" color="dimmed">
                          Unpublished
                        </MantineText>
                      </Box>
                    </Group>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Paper
                    p="md"
                    radius="md"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <Group justify="center">
                      <Box ta="center">
                        <MantineText size="lg" fw={600} color="blue">
                          {stats.recentEnrollments}
                        </MantineText>
                        <MantineText size="sm" color="dimmed">
                          Recent Enrollments
                        </MantineText>
                      </Box>
                    </Group>
                  </Paper>
                </Grid.Col>
              </Grid>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={6}>
          <Paper
            shadow="xs"
            p="xl"
            radius="lg"
            style={{ border: "1px solid #e9ecef", height: "100%" }}
          >
            <Title order={3} fw={600} c="dark.8" mb="xl">
              Course Distribution
            </Title>
            {(() => {
              // Filter out categories with 0 course count
              const validCategoryData = stats.categoryAnalytics.filter(
                (category) => category.course_count > 0
              );

              return validCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={validCategoryData}
                      dataKey="course_count"
                      nameKey="category_name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ category_name, course_count }) =>
                        `${category_name}: ${course_count}`
                      }
                    >
                      {validCategoryData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Group justify="center" style={{ height: "250px" }}>
                  <MantineText color="dimmed" ta="center">
                    No category data available
                  </MantineText>
                </Group>
              );
            })()}
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Payment Overview */}
      <Paper shadow="md" p="xl" radius="lg" withBorder>
        <Title order={3} fw={600} c="dark.8" mb="xl">
          Payment Overview
        </Title>
        <Grid gutter="md">
          {stats.paymentSummary.length > 0 ? (
            stats.paymentSummary.map((payment, index) => (
              // FIX 7: Menggunakan index sebagai key agar pasti unik
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }} key={index}>
                {/* ... (konten di dalam Grid.Col tetap sama) ... */}
                <Paper p="md" radius="md" withBorder style={{ height: "100%" }}>
                  <Group justify="space-between" align="center" mb="sm">
                    <MantineText fw={600} size="lg">
                      {payment.status}
                    </MantineText>
                    <Box
                      w={rem(20)}
                      h={rem(20)}
                      style={{ borderRadius: "50%" }}
                    />
                  </Group>
                  <MantineText size="xl" fw={700} mb={rem(4)}>
                    {payment.count}
                  </MantineText>
                  <MantineText size="sm" color="dimmed">
                    Total Amount:{" "}
                    <MantineText span fw={600} c="dark.7">
                      Rp {payment.total_amount.toLocaleString("id-ID")}
                    </MantineText>
                  </MantineText>
                </Paper>
              </Grid.Col>
            ))
          ) : (
            <Grid.Col span={12}>
              <MantineText color="dimmed" ta="center" py="xl">
                No payment data available.
              </MantineText>
            </Grid.Col>
          )}
        </Grid>
      </Paper>

      {/* Quick Actions */}
      <Paper
        shadow="xs"
        p="xl"
        radius="lg"
        style={{ border: "1px solid #e9ecef" }}
      >
        <Title order={3} fw={600} c="dark.8" mb="xl">
          Quick Actions
        </Title>
        <Grid>
          <Grid.Col span={4}>
            <Button
              fullWidth
              size="lg"
              radius="md"
              leftSection={<IconUserPlus size={20} />}
              onClick={() => {
                resetUserForm();
                setSelectedUser({});
              }}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                height: "60px",
              }}
            >
              Create New User
            </Button>
          </Grid.Col>
          <Grid.Col span={4}>
            <Button
              fullWidth
              size="lg"
              radius="md"
              leftSection={<IconPlus size={20} />}
              onClick={() => setSelectedCourse({})}
              style={{
                background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                border: "none",
                height: "60px",
              }}
            >
              Create New Course
            </Button>
          </Grid.Col>
          <Grid.Col span={4}>
            <Button
              fullWidth
              size="lg"
              radius="md"
              variant="outline"
              leftSection={<IconRefresh size={20} />}
              onClick={fetchDashboardData}
              style={{ height: "60px", borderWidth: "2px" }}
            >
              Refresh Data
            </Button>
          </Grid.Col>
        </Grid>
      </Paper>
    </Stack>
  );
};

export default OverviewTab;
