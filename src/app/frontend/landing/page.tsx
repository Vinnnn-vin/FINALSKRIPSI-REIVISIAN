// src/app/frontend/landing/page.tsx

import { Box } from "@mantine/core";
import { HeroSection } from "./components/HeroSection";
import { StatsSection } from "./components/StatsSection";
import { FeaturedCoursesSection } from "./components/FeaturedCoursesSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { CategoriesSection } from "./components/CategoriesSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import CtaSection from "./components/CtaSection"; // Pastikan nama file dan impor konsisten
import { getFeaturedCourses, getCategories } from "@/service/landing.service";

// Komponen ini sekarang adalah Server Component (async)
// Tidak ada lagi "use client", useState, useEffect untuk fetch data
export default async function LandingPage() {
  // Data diambil di server saat halaman di-build atau di-request
  const featuredCourses = await getFeaturedCourses();
  const categories = await getCategories();

  // Kita asumsikan totalCourses akan dihitung dari data dinamis nanti
  const totalCourses = featuredCourses.length; 

  return (
    <Box style={{ overflow: "hidden" }}>
      <HeroSection mounted={true} totalCourses={totalCourses} />
      <StatsSection />
      
      {/* Komponen anak sekarang hanya menerima data, tanpa isLoading atau error */}
      <FeaturedCoursesSection courses={featuredCourses} />
      
      <FeaturesSection />
      
      <CategoriesSection categories={categories} mounted={true} />
      
      <TestimonialsSection mounted={true} />

      <CtaSection />
    </Box>
  );
}