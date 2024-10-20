"use client";

import React from 'react';

interface FeedbackButtonProps {
    onClick: () => void;
    className?: string;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ onClick, className }) => {
  return (
    <button onClick={onClick} className={`mt-4 text-sm text-gray-500 dark:text-gray-400 hover:underline ${className}`}>
      feedback
    </button>
  );
};

export default FeedbackButton;