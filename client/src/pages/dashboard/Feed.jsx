import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import TaskCard from '@components/tasks/TaskCard';
import TaskDetailModal from '@components/tasks/TaskDetailModal';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { EmptyTasksState } from '@components/common/EmptyStates';
import api from '@services/api';
import { formatDateTime } from '@utils/helpers';
import toast from 'react-hot-toast';

// Transform server task data to the shape UI components expect
const transformTask = (task) => ({
  id: task._id,
  title: task.title,
  description: task.description,
  location: task.location,
  startTime: formatDateTime(task.startTime),
  endTime: task.endTime ? formatDateTime(task.endTime) : null,
  status: task.category || task.status,
  budget: task.budget,
  image: task.picture?.url || null,
  creator: task.userId
    ? {
        name: `${task.userId.firstName || ''} ${task.userId.lastName || ''}`.trim() || 'Unknown',
        avatar: task.userId.profilePicture?.url || task.userId.profilePicture || null,
        rating: task.userId.rating || 0,
        reviews: task.userId.reviewCount || 0,
        bio: task.userId.bio || '',
      }
    : { name: 'Unknown', avatar: null, rating: 0, reviews: 0, bio: '' },
  // Keep raw data for API calls
  _raw: task,
});

const Feed = () => {
  const { getToken } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.getTasks();
      const transformed = (response.data?.tasks || []).map(transformTask);
      setTasks(transformed);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(err.message);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Handle viewing task details
  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Handle request from modal
  const handleRequest = async (task, message) => {
    try {
      const token = await getToken();
      await api.createRequest({ taskId: task._raw._id, message }, token);
      toast.success(`Request sent to ${task.creator.name}!`);
    } catch (err) {
      toast.error(err.message || 'Failed to send request');
    }
  };

  // Handle quick request from card button
  const handleQuickRequest = (task) => {
    handleViewDetails(task); // Open modal for detailed request
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">Failed to load tasks</p>
        <button
          onClick={fetchTasks}
          className="text-primary-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Feed</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find tasks that need help
        </p>
      </div>

      {tasks.length === 0 ? (
        <EmptyTasksState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TaskCard
                task={task}
                onViewDetails={handleViewDetails}
                onRequest={handleQuickRequest}
                showRequestButton={true}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRequest={handleRequest}
      />
    </div>
  );
};

export default Feed;
