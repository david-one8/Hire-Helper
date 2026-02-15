import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { EmptyMyTasksState } from '@components/common/EmptyStates';
import api from '@services/api';
import { formatDateTime } from '@utils/helpers';
import toast from 'react-hot-toast';

const statusStyles = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  in_progress: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const MyTasks = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await api.getMyTasks({}, token);
      setMyTasks(response.data?.tasks || []);
    } catch (err) {
      console.error('Failed to fetch my tasks:', err);
      toast.error('Failed to load your tasks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your posted tasks
          </p>
        </div>
        <Button
          icon={<Plus size={20} />}
          onClick={() => navigate('/add-task')}
        >
          Add New Task
        </Button>
      </div>

      {myTasks.length === 0 ? (
        <EmptyMyTasksState onCreateTask={() => navigate('/add-task')} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {myTasks.map((task, index) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="overflow-hidden">
                <div className="flex gap-4">
                  {task.picture?.url && (
                    <img
                      src={task.picture.url}
                      alt={task.title}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold">{task.title}</h3>
                      <span
                        className={`badge ${statusStyles[task.status] || statusStyles.active}`}
                      >
                        {task.status?.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                      <p>📍 {task.location}</p>
                      <p>📅 {formatDateTime(task.startTime)}{task.endTime ? ` - ${formatDateTime(task.endTime)}` : ''}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
