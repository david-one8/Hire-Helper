import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Clock,
  Calendar,
  User,
  Star,
  DollarSign,
  MessageSquare,
} from 'lucide-react';
import Button from '@components/common/Button';
import Avatar from '@components/common/Avatar';
import { formatDate } from '@utils/helpers';
import toast from 'react-hot-toast';

const TaskDetailModal = ({ task, isOpen, onClose, onRequest }) => {
  const [requestMessage, setRequestMessage] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);

  if (!task) return null;

  const handleSendRequest = () => {
    if (requestMessage.trim().length < 10) {
      toast.error('Please write a message (at least 10 characters)');
      return;
    }

    onRequest?.(task, requestMessage);
    setRequestMessage('');
    setShowRequestForm(false);
    onClose();
    toast.success('Request sent successfully!');
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    moving: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    gardening: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    painting: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-3xl bg-white dark:bg-dark-800 rounded-2xl shadow-2xl overflow-hidden my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-dark-900/90 backdrop-blur-sm rounded-full hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors shadow-lg"
              >
                <X size={20} />
              </button>

              {/* Image */}
              {task.image && (
                <div className="relative h-64 sm:h-80 overflow-hidden bg-gray-200 dark:bg-dark-700">
                  <img
                    src={task.image}
                    alt={task.title}
                    className="w-full h-full object-cover"
                  />
                  {task.status && (
                    <div className="absolute top-4 left-4">
                      <span className={`badge ${statusColors[task.status]} text-sm`}>
                        {task.status}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">{task.title}</h2>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <MessageSquare size={20} className="text-primary-600" />
                    Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-dark-700/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Location
                      </p>
                      <p className="font-medium">{task.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Start Date & Time
                      </p>
                      <p className="font-medium">{task.startTime}</p>
                    </div>
                  </div>

                  {task.endTime && (
                    <div className="flex items-start gap-3">
                      <Clock className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          End Time
                        </p>
                        <p className="font-medium">{task.endTime}</p>
                      </div>
                    </div>
                  )}

                  {task.budget && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Budget
                        </p>
                        <p className="font-medium">${task.budget}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Creator Info */}
                <div className="border-t border-gray-200 dark:border-dark-700 pt-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Task Creator</h3>
                  <div className="flex items-start gap-4">
                    <Avatar
                      src={task.creator?.avatar}
                      alt={task.creator?.name}
                      size="xl"
                      fallback={task.creator?.name?.[0]}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">
                        {task.creator?.name || 'Unknown User'}
                      </h4>
                      {task.creator?.rating && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star size={16} fill="currentColor" />
                            <span className="font-medium">{task.creator.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            ({task.creator.reviews || 0} reviews)
                          </span>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {task.creator?.bio || 'Member since 2024'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Request Form */}
                {showRequestForm ? (
                  <div className="border-t border-gray-200 dark:border-dark-700 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Send Request</h3>
                    <textarea
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      placeholder="Introduce yourself and explain why you're a good fit for this task..."
                      rows="4"
                      className="w-full px-4 py-3 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 resize-none mb-4"
                    />
                    <div className="flex gap-3">
                      <Button fullWidth onClick={handleSendRequest}>
                        Send Request
                      </Button>
                      <Button
                        fullWidth
                        variant="outline"
                        onClick={() => {
                          setShowRequestForm(false);
                          setRequestMessage('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button fullWidth onClick={() => setShowRequestForm(true)}>
                      Request to Help
                    </Button>
                    <Button fullWidth variant="outline" onClick={onClose}>
                      Close
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskDetailModal;
