// src\app\frontend\dashboard\student\learn\[enrollmentId]\components\ProgressIndicator.tsx

import React from 'react';

const ProgressIndicator: React.FC = () => {
  return (
    <div style={styles.centered}>
      Memuat data pembelajaran...
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
};

export default ProgressIndicator;