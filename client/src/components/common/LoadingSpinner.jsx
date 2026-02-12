import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const spinner = (
    <motion.div
      className={`${sizes[size]} border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-400 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-dark-950/80 backdrop-blur-sm z-50">
        <div className="text-center">
          {spinner}
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
