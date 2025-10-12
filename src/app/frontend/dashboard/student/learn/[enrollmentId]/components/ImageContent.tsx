// src\app\frontend\dashboard\student\learn\[enrollmentId]\components\ImageContent.tsx
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useLearningData } from '@/hooks/useLearningData';

interface ImageContentProps {
  detail: any;
}

const ImageContent: React.FC<ImageContentProps> = ({ detail }) => {
  const { handleMarkAsComplete } = useLearningData();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const completeButton = !detail.is_completed && (
    <button
      style={styles.button}
      onClick={() => handleMarkAsComplete(detail.material_detail_id)}
    >
      Tandai Selesai
    </button>
  );

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleDownload = () => {
    if (detail.materi_detail_url) {
      const link = document.createElement('a');
      link.href = detail.materi_detail_url;
      link.download = detail.material_detail_name || 'image';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div style={styles.contentContainer}>
      <h2>{detail.material_detail_name}</h2>
      <p style={styles.description}>{detail.material_detail_description}</p>
      
      <div style={styles.imageContainer}>
        {!imageLoaded && !imageError && (
          <div style={styles.imagePlaceholder}>
            <div style={styles.loadingSpinner}></div>
            <p>Memuat gambar...</p>
          </div>
        )}
        
        {imageError && (
          <div style={styles.imageError}>
            <span style={styles.errorIcon}>🖼️</span>
            <p>Tidak dapat memuat gambar</p>
            <button style={styles.retryButton} onClick={() => setImageError(false)}>
              Coba Lagi
            </button>
          </div>
        )}
        
        {detail.materi_detail_url && (
          <img
            src={detail.materi_detail_url}
            alt={detail.material_detail_name}
            style={{
              ...styles.image,
              display: imageError ? 'none' : 'block'
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </div>
      
      {imageLoaded && (
        <div style={styles.imageActions}>
          <button
            style={styles.downloadButton}
            onClick={handleDownload}
          >
            📥 Unduh Gambar
          </button>
          <button
            style={styles.viewButton}
            onClick={() => window.open(detail.materi_detail_url, '_blank')}
          >
            🔍 Lihat Ukuran Penuh
          </button>
        </div>
      )}
      
      {completeButton}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  contentContainer: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  description: {
    color: "#666",
    marginBottom: "1.5rem",
    lineHeight: "1.6",
    fontSize: "1rem",
  },
  button: {
    marginTop: "1.5rem",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.2s",
    textDecoration: "none",
    display: "inline-block",
  },
  imageContainer: {
    backgroundColor: "#f8f9fa",
    border: "1px solid #dee2e6",
    borderRadius: "8px",
    padding: "1rem",
    textAlign: "center",
    marginBottom: "2rem",
    minHeight: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "70vh",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  imagePlaceholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#666",
  },
  loadingSpinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #007bff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "1rem",
  },
  imageError: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#dc3545",
  },
  errorIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  retryButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginTop: "1rem",
  },
  imageActions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    marginBottom: "1rem",
  },
  downloadButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.2s",
  },
  viewButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.2s",
  },
};

export default ImageContent;