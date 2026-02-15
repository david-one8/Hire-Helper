import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import Card from '@components/common/Card';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { EmptyMyRequestsState } from '@components/common/EmptyStates';
import api from '@services/api';
import { getTimeAgo } from '@utils/helpers';
import toast from 'react-hot-toast';

const MyRequests = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await api.getSentRequests({}, token);
      setMyRequests(response.data?.requests || []);
    } catch (err) {
      console.error('Failed to fetch sent requests:', err);
      toast.error('Failed to load your requests');
    } finally {
      setLoading(false);
    }
  };

  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    accepted: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Requests</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track the help requests you've sent
        </p>
      </div>

      {myRequests.length === 0 ? (
        <EmptyMyRequestsState onBrowseTasks={() => navigate('/feed')} />
      ) : (
        <div className="space-y-4">
          {myRequests.map((request, index) => {
            const task = request.taskId || {};
            const taskOwner = request.taskOwnerId || {};
            const ownerName = `${taskOwner.firstName || ''} ${taskOwner.lastName || ''}`.trim() || 'Unknown';
            const taskImage = task.picture?.url || null;
            const taskLocation = task.location || '';

            return (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <div className="flex gap-4">
                    {/* Task Image */}
                    {taskImage && (
                      <img
                        src={taskImage}
                        alt={task.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">
                            {task.title || 'Unknown Task'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Task owner: {ownerName}
                          </p>
                        </div>
                        <span className={`badge ${statusStyles[request.status] || statusStyles.pending}`}>
                          {request.status}
                        </span>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Your message:
                        </p>
                        <p className="text-sm">{request.message}</p>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          {getTimeAgo(request.createdAt)}
                        </div>
                        {taskLocation && (
                          <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            {taskLocation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRequests;
