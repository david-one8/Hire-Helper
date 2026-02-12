import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  illustration,
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {/* Illustration or Icon */}
      <div className="mb-6">
        {illustration ? (
          <div className="w-48 h-48 sm:w-64 sm:h-64">
            {illustration}
          </div>
        ) : Icon ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-dark-800 dark:to-dark-700 rounded-full flex items-center justify-center mb-4"
          >
            <Icon size={48} className="text-gray-400 dark:text-gray-500" />
          </motion.div>
        ) : null}
      </div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 dark:text-gray-400 max-w-md mb-6"
      >
        {description}
      </motion.p>

      {/* Action Button or Custom Children */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {children || (
          actionLabel && onAction && (
            <Button onClick={onAction} size="lg">
              {actionLabel}
            </Button>
          )
        )}
      </motion.div>
    </motion.div>
  );
};

export default EmptyState;
