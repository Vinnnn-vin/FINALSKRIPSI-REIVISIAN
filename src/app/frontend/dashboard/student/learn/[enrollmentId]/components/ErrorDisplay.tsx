// src\app\frontend\dashboard\student\learn\[enrollmentId]\components\ErrorDisplay.tsx

import React from 'react';

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <div style={{ ...styles.centered, color: "red" }}>
      <div>
        <h3>Terjadi Kesalahan</h3>
        <p>{error}</p>
        <button
          style={styles.button}
          onClick={() => window.location.reload()}
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  centered: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  button: {
    marginTop: "1rem",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default ErrorDisplay;