// src\app\frontend\dashboard\student\learn\[enrollmentId]\components\VideoContent.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useLearningData } from '@/hooks/useLearningData';

interface VideoContentProps {
  detail: any;
}

const VideoContent: React.FC<VideoContentProps> = ({ detail }) => {
  const { handleMarkAsComplete } = useLearningData();
  
  return (
    <div style={styles.contentContainer}>
      <h2>{detail.material_detail_name || 'Video Pembelajaran'}</h2>
      {detail.material_detail_description && (
        <p style={styles.description}>{detail.material_detail_description}</p>
      )}
      
      {detail.materi_detail_url ? (
        <div style={styles.videoContainer}>
          <video
            src={detail.materi_detail_url}
            controls
            style={styles.videoPlayer}
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div style={styles.noVideoContainer}>
          <p>URL video tidak tersedia</p>
        </div>
      )}
      
      {!detail.is_completed && (
        <button
          style={styles.button}
          onClick={() => handleMarkAsComplete(detail.material_detail_id)}
        >
          Tandai Selesai
        </button>
      )}
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
  },
  videoContainer: {
    width: "100%",
    maxWidth: "800px",
    margin: "1rem auto 2rem",
    backgroundColor: "#000",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  videoPlayer: {
    width: "100%",
    height: "auto",
    aspectRatio: "16/9",
    display: "block",
  },
  noVideoContainer: {
    padding: "2rem",
    textAlign: "center",
    backgroundColor: "#f8f9fa",
    border: "1px solid #dee2e6",
    borderRadius: "8px",
    color: "#666",
  },
};

export default VideoContent;