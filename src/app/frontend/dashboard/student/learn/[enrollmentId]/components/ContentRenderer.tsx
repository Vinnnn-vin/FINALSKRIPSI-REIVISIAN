// src\app\frontend\dashboard\student\learn\[enrollmentId]\components\ContentRenderer.tsx

import React from 'react';
import VideoContent from './VideoContent';
import DocumentContent from './DocumentContent';
import ImageContent from './ImageContent';
import AssignmentContent from './AssignmentContent';
import QuizContent from './QuizContent';
import { useLearningStore } from '@/stores/learningStore';

const ContentRenderer: React.FC = () => {
  const { data, selectedItem } = useLearningStore();

  const getSelectedItemData = () => {
    if (!selectedItem || !data || !data.course || !data.course.materials)
      return null;

    for (const material of data.course.materials) {
      if (selectedItem.type === "detail" && material.details) {
        const detail = material.details.find(
          (d) => d.material_detail_id === selectedItem.id
        );
        if (detail) return { ...detail, type: "detail" as const, material };
      } else if (selectedItem.type === "quiz" && material.quizzes) {
        const quiz = material.quizzes.find(
          (q) => q.quiz_id === selectedItem.id
        );
        if (quiz) return { ...quiz, type: "quiz" as const, material };
      }
    }
    return null;
  };

  const currentItem = getSelectedItemData();

  // Early returns for loading/error states
  if (!data) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.loadingIcon}>⏳</div>
        <h3>Memuat data pembelajaran...</h3>
        <p>Harap tunggu sebentar.</p>
      </div>
    );
  }

  if (!data.course) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.errorIcon}>❌</div>
        <h3>Course tidak ditemukan</h3>
        <p>Data course tidak tersedia.</p>
      </div>
    );
  }

  if (!data.course.materials || data.course.materials.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📚</div>
        <h3>Belum Ada Materi Pembelajaran</h3>
        <p>Course ini belum memiliki materi pembelajaran.</p>
      </div>
    );
  }

  if (!selectedItem) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.selectIcon}>👈</div>
        <h3>Pilih Materi untuk Memulai Pembelajaran</h3>
        <p>Silakan pilih materi atau quiz dari sidebar untuk memulai belajar.</p>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.errorIcon}>⚠️</div>
        <h3>Materi Tidak Ditemukan</h3>
        <p>Materi yang dipilih tidak dapat ditemukan.</p>
      </div>
    );
  }

  // Render the actual content
  const renderContent = () => {
    if (currentItem.type === "detail") {
      switch (currentItem.material_detail_type) {
        case 1: // Video
          return <VideoContent detail={currentItem} />;
        case 2: // Document
          return <DocumentContent detail={currentItem} />;
        case 3: // Image
          return <ImageContent detail={currentItem} />;
        case 4: // Assignment
          return <AssignmentContent detail={currentItem} />;
        default:
          return <DocumentContent detail={currentItem} />;
      }
    } else if (currentItem.type === "quiz") {
      return <QuizContent quiz={currentItem} />;
    }
    return null;
  };

  return (
    <main style={styles.mainContent}>
      {renderContent()}
    </main>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  mainContent: {
    flex: 1,
    padding: "2rem",
    overflowY: "auto",
    backgroundColor: "#ffffff",
  },
  emptyState: {
    textAlign: "center",
    padding: "4rem 2rem",
    color: "#666",
    maxWidth: "600px",
    margin: "0 auto",
  },
  loadingIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  errorIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "1.5rem",
  },
  selectIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
};

export default ContentRenderer;