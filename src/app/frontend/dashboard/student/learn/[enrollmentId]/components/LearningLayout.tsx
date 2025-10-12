// src\app\frontend\dashboard\student\learn\[enrollmentId]\components\LearningLayout.tsx

import React from 'react';
import LearningSidebar from './LearningSidebar';
import ContentRenderer from './ContentRenderer';
import ErrorDisplay from './ErrorDisplay';
import ProgressIndicator from './ProgressIndicator';
import { useLearningStore } from '@/stores/learningStore';

const LearningLayout: React.FC = () => {
  const { loading, error, data } = useLearningStore();

  if (loading) {
    return <ProgressIndicator />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Data pembelajaran tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div style={styles.layout}>
      <LearningSidebar />
      <ContentRenderer />
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'sans-serif',
    color: '#333',
  },
};

export default LearningLayout;