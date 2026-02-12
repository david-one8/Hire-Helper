import React from 'react';
import { motion } from 'framer-motion';
import RequestCard from './RequestCard';
import LoadingSpinner from '@components/common/LoadingSpinner';
import Card from '@components/common/Card';

const RequestList = ({
  requests,
  loading,
  onAccept,
  onDecline,
  emptyMessage = 'No requests yet',
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request, index) => (
        <motion.div
          key={request.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <RequestCard
            request={request}
            onAccept={onAccept}
            onDecline={onDecline}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default RequestList;
