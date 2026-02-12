import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar, User } from 'lucide-react';
import Avatar from '@components/common/Avatar';
import Button from '@components/common/Button';

const TaskDetail = ({ task, onRequest, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      {/* Image */}
      {task.image && (
        <img
          src={task.image}
          alt={task.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      {/* Title and Status */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-2xl font-bold">{task.title}</h2>
          {task.status && (
            <span className="badge badge-active">{task.status}</span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {task.description}
        </p>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
          <MapPin className="text-primary-600" size={20} />
          <span>{task.location}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
          <Calendar className="text-primary-600" size={20} />
          <span>{task.startTime}</span>
        </div>
        {task.endTime && (
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Clock className="text-primary-600" size={20} />
            <span>Until {task.endTime}</span>
          </div>
        )}
      </div>

      {/* Creator */}
      <div className="border-t border-gray-200 dark:border-dark-700 pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-3">Task Creator</h3>
        <div className="flex items-center gap-3">
          <Avatar
            src={task.creator?.avatar}
            alt={task.creator?.name}
            size="lg"
            fallback={task.creator?.name?.[0]}
          />
          <div>
            <p className="font-medium">{task.creator?.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Member since 2024
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button fullWidth variant="secondary" onClick={() => onRequest?.(task)}>
          Send Request
        </Button>
        <Button fullWidth variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </motion.div>
  );
};

export default TaskDetail;
