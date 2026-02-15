import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Star } from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Avatar from '@components/common/Avatar';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { EmptyRequestsState } from '@components/common/EmptyStates';
import api from '@services/api';
import { getTimeAgo } from '@utils/helpers';
import toast from 'react-hot-toast';

const Requests = () => {
  const { getToken } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await api.getReceivedRequests({}, token);
      setRequests(response.data?.requests || []);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      const token = await getToken();
      await api.acceptRequest(id, '', token);
      setRequests(requests.filter((req) => req._id !== id));
      toast.success('Request accepted!');
    } catch (err) {
      toast.error(err.message || 'Failed to accept request');
    }
  };

  const handleDecline = async (id) => {
    try {
      const token = await getToken();
      await api.rejectRequest(id, '', token);
      setRequests(requests.filter((req) => req._id !== id));
      toast.success('Request declined');
    } catch (err) {
      toast.error(err.message || 'Failed to decline request');
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Requests</h1>
        <p className="text-gray-600 dark:text-gray-400">
          People who want to help with your tasks
        </p>
      </div>

      {requests.length === 0 ? (
        <EmptyRequestsState />
      ) : (
        <div className="space-y-4">
          {requests.map((request, index) => {
            const requester = request.requesterId || {};
            const requesterName = `${requester.firstName || ''} ${requester.lastName || ''}`.trim() || 'Unknown';
            const taskTitle = request.taskId?.title || 'Unknown Task';
            const taskLocation = request.taskId?.location || '';

            return (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Profile */}
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar
                        src={requester.profilePicture?.url || requester.profilePicture}
                        alt={requesterName}
                        size="xl"
                        fallback={requesterName[0]}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">
                            {requesterName}
                          </h3>
                          {requester.rating > 0 && (
                            <div className="flex items-center gap-1 text-sm text-yellow-500">
                              <Star size={16} fill="currentColor" />
                              <span className="font-medium">
                                {requester.rating}
                              </span>
                              <span className="text-gray-400">
                                ({requester.reviewCount || 0} reviews)
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Requesting for:
                          </p>
                          <p className="font-medium text-primary-600 dark:text-primary-400">
                            {taskTitle}
                          </p>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Their message:
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

                    {/* Actions */}
                    {request.status === 'pending' && (
                      <div className="flex md:flex-col gap-3 md:min-w-[120px]">
                        <Button
                          variant="secondary"
                          size="sm"
                          fullWidth
                          onClick={() => handleAccept(request._id)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          fullWidth
                          onClick={() => handleDecline(request._id)}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
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

export default Requests;
