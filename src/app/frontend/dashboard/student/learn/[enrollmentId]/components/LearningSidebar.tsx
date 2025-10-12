// src\app\frontend\dashboard\student\learn\[enrollmentId]\components\LearningSidebar.tsx

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLearningStore } from '@/stores/learningStore';

const LearningSidebar: React.FC = () => {
  const router = useRouter();
  const { data, selectedItem, setSelectedItem } = useLearningStore();

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/frontend/dashboard/student');
    }
  }, [router]);

  // Fungsi untuk menangani klik item dengan logging yang lebih detail
  const handleItemClick = useCallback((type: "detail" | "quiz", id: number, material_id: number, itemName: string) => {
    console.log('=== KLIK ITEM ===');
    console.log('Tipe:', type);
    console.log('ID:', id);
    console.log('Material ID:', material_id);
    console.log('Nama Item:', itemName);
    console.log('Selected Item Sebelumnya:', selectedItem);
    
    const newSelection = {
      type,
      id,
      material_id
    };
    
    setSelectedItem(newSelection);
    console.log('Selected Item Baru:', newSelection);
    console.log('=================');
  }, [setSelectedItem, selectedItem]);

  if (!data) {
    console.log('Data tidak tersedia di sidebar');
    return null;
  }

  const getTypeIcon = (type: number) => {
    switch (type) {
      case 1: return "📹"; // Video
      case 2: return "📄"; // Document  
      case 3: return "🖼"; // Image
      case 4: return "📝"; // Assignment
      default: return "📄";
    }
  };

  console.log('Rendering sidebar dengan data:', data);
  console.log('Selected item saat ini:', selectedItem);

  return (
    <aside style={styles.sidebar}>
      <button 
        style={styles.backButton}
        onClick={handleBack}
      >
        ← Kembali ke Dashboard
      </button>

      <div style={styles.courseHeader}>
        <h2>{data.course?.course_title || "Kursus"}</h2>
        {data.course?.instructor && (
          <p style={styles.instructorInfo}>
            Instruktur: {data.course.instructor.first_name} {data.course.instructor.last_name}
          </p>
        )}
        {data.progress_percentage !== undefined && (
          <div style={styles.progressContainer}>
            <div style={styles.progressLabel}>Progress: {Math.round(data.progress_percentage)}%</div>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${data.progress_percentage}%`
                }}
              />
            </div>
          </div>
        )}
      </div>

      {data.course?.materials && data.course.materials.length > 0 ? (
        <div style={styles.materialsContainer}>
          {data.course.materials.map((material, materialIndex) => {
            console.log(`Rendering material ${materialIndex}:`, material);
            
            return (
              <div key={`material-${material.material_id}`} style={styles.materialSection}>
                <h3 style={styles.materialTitle}>{material.material_name}</h3>
                {material.material_description && (
                  <p style={styles.materialDesc}>{material.material_description}</p>
                )}

                {/* Material Details */}
                {material.details && material.details.length > 0 && (
                  <div style={styles.itemsContainer}>
                    {material.details.map((detail, detailIndex) => {
                      const isSelected = selectedItem?.id === detail.material_detail_id && selectedItem?.type === "detail";
                      console.log(`Detail ${detailIndex} (${detail.material_detail_name}):`, {
                        id: detail.material_detail_id,
                        isSelected,
                        selectedItem
                      });

                      return (
                        <button
                          key={`detail-${detail.material_detail_id}`}
                          type="button"
                          style={{
                            ...styles.navButton,
                            ...(isSelected ? styles.navButtonActive : {}),
                          }}
                          onClick={() => {
                            handleItemClick("detail", detail.material_detail_id, material.material_id, detail.material_detail_name);
                          }}
                          onMouseDown={(e) => {
                            console.log('Mouse down pada detail:', detail.material_detail_name);
                          }}
                        >
                          <div style={styles.buttonContent}>
                            <span style={styles.navIcon}>
                              {detail.is_completed ? "✅" : getTypeIcon(detail.material_detail_type)}
                            </span>
                            <div style={styles.navItemText}>
                              <div style={styles.itemTitle}>{detail.material_detail_name}</div>
                              {detail.is_free && (
                                <span style={styles.freeLabel}>GRATIS</span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Quizzes */}
                {material.quizzes && material.quizzes.length > 0 && (
                  <div style={styles.itemsContainer}>
                    {material.quizzes.map((quiz, quizIndex) => {
                      // Logika perbandingan yang lebih ketat untuk quiz
                      const isSelected = selectedItem?.type === "quiz" && 
                                       selectedItem?.id === quiz.quiz_id && 
                                       selectedItem?.material_id === material.material_id;
                                       
                      console.log(`🧠 Quiz ${quizIndex} (${quiz.quiz_title}):`, {
                        quizId: quiz.quiz_id,
                        materialId: material.material_id,
                        isSelected: isSelected,
                        selectedItem: selectedItem,
                        comparison: {
                          typeMatch: selectedItem?.type === "quiz",
                          idMatch: selectedItem?.id === quiz.quiz_id,
                          materialIdMatch: selectedItem?.material_id === material.material_id
                        }
                      });
                      
                      return (
                        <button
                          key={`quiz-${quiz.quiz_id}`}
                          type="button"
                          style={{
                            ...styles.quizButton,
                            ...(isSelected ? styles.quizButtonActive : {}),
                          }}
                          onClick={() => {
                            handleItemClick("quiz", quiz.quiz_id, material.material_id, quiz.quiz_title);
                          }}
                          onMouseDown={(e) => {
                            console.log('Mouse down pada quiz:', quiz.quiz_title);
                          }}
                        >
                          <div style={styles.buttonContent}>
                            <span style={styles.navIcon}>✏️</span>
                            <div style={styles.navItemText}>
                              <div style={styles.itemTitle}>{quiz.quiz_title}</div>
                              <div style={styles.quizMeta}>
                                Minimal: {quiz.passing_score || 70}%
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.emptyMaterialsContainer}>
          <div style={styles.emptyIcon}>📚</div>
          <h3 style={styles.emptyTitle}>Belum Ada Materi</h3>
          <p style={styles.emptyMessage}>
            Course ini belum memiliki materi pembelajaran.
          </p>
        </div>
      )}
    </aside>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: 400,
    padding: "1rem",
    borderRight: "1px solid #e0e0e0",
    overflowY: "auto",
    backgroundColor: "#f8f9fa",
  },
  backButton: {
    background: "none",
    border: "none",
    padding: "0.5rem 0",
    marginBottom: "1rem",
    cursor: "pointer",
    fontSize: "1rem",
    color: "#007bff",
    textDecoration: "underline",
  },
  courseHeader: {
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #e0e0e0",
  },
  instructorInfo: {
    color: "#666",
    margin: "0.5rem 0",
    fontSize: "0.9rem",
  },
  progressContainer: {
    marginTop: "1rem",
  },
  progressLabel: {
    fontSize: "0.9rem",
    marginBottom: "0.5rem",
    fontWeight: "500",
  },
  progressBar: {
    width: "100%",
    height: "8px",
    backgroundColor: "#e0e0e0",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#28a745",
    transition: "width 0.3s ease",
  },
  materialsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  materialSection: {
    marginBottom: "1.5rem",
  },
  materialTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
    color: "#2c3e50",
  },
  materialDesc: {
    fontSize: "0.9rem",
    color: "#666",
    marginBottom: "0.75rem",
    fontStyle: "italic",
  },
  itemsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  // Button style untuk material details
  navButton: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "6px",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s ease",
    fontSize: "inherit",
    fontFamily: "inherit",
  },
  navButtonActive: {
    backgroundColor: "#e3f2fd",
    border: "1px solid #2196f3",
    boxShadow: "0 2px 4px rgba(33, 150, 243, 0.1)",
  },
  // Button style untuk quiz
  quizButton: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "6px",
    backgroundColor: "#fff5e6",
    border: "1px solid #ffa500",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s ease",
    fontSize: "inherit",
    fontFamily: "inherit",
  },
  quizButtonActive: {
    backgroundColor: "#fff3cd",
    border: "1px solid #ffc107",
    boxShadow: "0 2px 4px rgba(255, 193, 7, 0.2)",
  },
  buttonContent: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
    width: "100%",
  },
  navIcon: {
    fontSize: "1.2rem",
    flexShrink: 0,
  },
  navItemText: {
    flex: 1,
    lineHeight: "1.4",
  },
  itemTitle: {
    fontWeight: "500",
    color: "#333",
  },
  freeLabel: {
    display: "inline-block",
    backgroundColor: "#28a745",
    color: "white",
    fontSize: "0.7rem",
    padding: "0.2rem 0.4rem",
    borderRadius: "3px",
    marginTop: "0.25rem",
    fontWeight: "bold",
  },
  quizMeta: {
    fontSize: "0.8rem",
    color: "#666",
    marginTop: "0.25rem",
  },
  emptyMaterialsContainer: {
    textAlign: "center",
    padding: "2rem 1rem",
    color: "#666",
  },
  emptyIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  emptyTitle: {
    fontSize: "1.1rem",
    marginBottom: "0.5rem",
  },
  emptyMessage: {
    fontStyle: "italic",
    fontSize: "0.9rem",
  },
};

export default LearningSidebar;