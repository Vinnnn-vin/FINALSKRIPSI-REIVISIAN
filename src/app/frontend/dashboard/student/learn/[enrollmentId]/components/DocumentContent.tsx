// src\app\frontend\dashboard\student\learn\[enrollmentId]\components\DocumentContent.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useLearningData } from '@/hooks/useLearningData';

interface DocumentContentProps {
  detail: any;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ detail }) => {
  const { handleMarkAsComplete } = useLearningData();

  const completeButton = !detail.is_completed && (
    <button
      style={styles.button}
      onClick={() => handleMarkAsComplete(detail.material_detail_id)}
    >
      Tandai Selesai
    </button>
  );

  const handleDownload = () => {
    if (detail.materi_detail_url) {
      window.open(detail.materi_detail_url, '_blank');
    }
  };

  const getFileExtension = (url: string) => {
    if (!url) return '';
    const extension = url.split('.').pop()?.toLowerCase();
    return extension || '';
  };

  const getFileIcon = (url: string) => {
    const ext = getFileExtension(url);
    switch (ext) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'ppt':
      case 'pptx':
        return '📊';
      case 'xls':
      case 'xlsx':
        return '📋';
      default:
        return '📄';
    }
  };

  return (
    <div style={styles.contentContainer}>
      <h2>{detail.material_detail_name}</h2>
      <p style={styles.description}>{detail.material_detail_description}</p>
      
      <div style={styles.documentContainer}>
        <div style={styles.documentInfo}>
          <span style={styles.fileIcon}>{getFileIcon(detail.materi_detail_url)}</span>
          <div style={styles.fileInfo}>
            <h3 style={styles.fileName}>{detail.material_detail_name}</h3>
            <p style={styles.fileType}>
              File {getFileExtension(detail.materi_detail_url).toUpperCase()}
            </p>
          </div>
        </div>
        
        {detail.materi_detail_url && (
          <button
            style={styles.downloadButton}
            onClick={handleDownload}
          >
            📥 Unduh Dokumen
          </button>
        )}
        
        {/* Embed PDF if it's a PDF file */}
        {getFileExtension(detail.materi_detail_url) === 'pdf' && (
          <div style={styles.pdfContainer}>
            <iframe
              src={detail.materi_detail_url}
              style={styles.pdfFrame}
              title="Document Viewer"
            />
          </div>
        )}
      </div>
      
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
  documentContainer: {
    backgroundColor: "#f8f9fa",
    border: "2px dashed #dee2e6",
    borderRadius: "8px",
    padding: "2rem",
    textAlign: "center",
    marginBottom: "2rem",
  },
  documentInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  fileIcon: {
    fontSize: "3rem",
  },
  fileInfo: {
    textAlign: "left",
  },
  fileName: {
    margin: 0,
    fontSize: "1.2rem",
    color: "#333",
  },
  fileType: {
    margin: "0.25rem 0 0 0",
    color: "#666",
    fontSize: "0.9rem",
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
  pdfContainer: {
    marginTop: "2rem",
    border: "1px solid #dee2e6",
    borderRadius: "8px",
    overflow: "hidden",
  },
  pdfFrame: {
    width: "100%",
    height: "600px",
    border: "none",
  },
};

export default DocumentContent;