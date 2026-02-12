import React from 'react';
import { motion } from 'framer-motion';
import TaskCard from './TaskCard';
import LoadingSpinner from '@components/common/LoadingSpinner';

const TaskGrid = ({ tasks, loading, onRequest, emptyMessage = 'No tasks found' }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task, index) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <TaskCard task={task} onRequest={onRequest} />
        </motion.div>
      ))}
    </div>
  );
};

export default TaskGrid;
