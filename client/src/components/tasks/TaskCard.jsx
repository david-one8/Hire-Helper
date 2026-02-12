import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, User } from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Avatar from '@components/common/Avatar';

const TaskCard = ({ task, onRequest, onViewDetails, showRequestButton = true }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    moving: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    gardening: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    painting: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(task);
    }
  };

  const handleRequestClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking button
    if (onRequest) {
      onRequest(task);
    }
  };

  return (
    <Card 
      hover 
      className="group overflow-hidden p-0 cursor-pointer" 
      onClick={handleCardClick}
    >
      {/* Image */}
      {task.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={task.image}
            alt={task.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {task.status && (
            <div className="absolute top-3 left-3">
              <span className={`badge ${statusColors[task.status]}`}>
                {task.status}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">
          {task.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {task.description}
        </p>

        <div className="space-y-2 mb-4">
          {task.location && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin size={16} className="mr-2 flex-shrink-0" />
              <span className="line-clamp-1">{task.location}</span>
            </div>
          )}
          {task.startTime && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock size={16} className="mr-2 flex-shrink-0" />
              <span className="line-clamp-1">
                {task.startTime}
                {task.endTime && ` - ${task.endTime}`}
              </span>
            </div>
          )}
        </div>

        {/* Creator & Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-700">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Avatar
              src={task.creator?.avatar}
              alt={task.creator?.name}
              size="sm"
              fallback={task.creator?.name?.[0]}
            />
            <span className="text-sm font-medium truncate">
              {task.creator?.name || 'Unknown'}
            </span>
          </div>
          {showRequestButton && (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleRequestClick}
            >
              Request
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
