import { useState, useEffect } from 'react';
import { requestService } from '@services/requestService';
import toast from 'react-hot-toast';

export const useRequests = (userId) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await requestService.getUserRequests(userId);
      setRequests(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (taskId, message) => {
    try {
      const newRequest = await requestService.sendRequest({
        taskId,
        message,
        userId,
      });
      setRequests((prev) => [newRequest, ...prev]);
      toast.success('Request sent successfully');
      return newRequest;
    } catch (err) {
      toast.error('Failed to send request');
      throw err;
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      await requestService.updateRequest(requestId, { status: 'accepted' });
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: 'accepted' } : req
        )
      );
      toast.success('Request accepted');
    } catch (err) {
      toast.error('Failed to accept request');
      throw err;
    }
  };

  const declineRequest = async (requestId) => {
    try {
      await requestService.updateRequest(requestId, { status: 'rejected' });
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
      toast.success('Request declined');
    } catch (err) {
      toast.error('Failed to decline request');
      throw err;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchRequests();
    }
  }, [userId]);

  return {
    requests,
    loading,
    error,
    sendRequest,
    acceptRequest,
    declineRequest,
    refetch: fetchRequests,
  };
};
