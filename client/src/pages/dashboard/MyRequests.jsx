import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import Card from '@components/common/Card';

const MyRequests = () => {
  const myRequests = [
    {
      id: 1,
      task: {
        title: 'Help Moving Furniture',
        creator: 'Sarah Johnson',
        image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=300',
      },
      message: "I'd be happy to help with your move! I have experience with heavy lifting...",
      status: 'pending',
      sentAt: 'Sent Jul 4, 10:00 AM',
      location: 'Downtown Seattle, WA',
    },
    {
      id: 2,
      task: {
        title: 'Garden Cleanup',
        creator: 'Robert Wilson',
        image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300',
      },
      message: 'I love gardening and would be happy to help...',
      status: 'accepted',
      sentAt: 'Sent Jul 3, 2:00 PM',
      location: 'Bellevue, WA',
    },
  ];

  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    accepted: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    declined: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Requests</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track the help requests you've sent
        </p>
      </div>

      <div className="space-y-4">
        {myRequests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex gap-4">
                {/* Task Image */}
                <img
                  src={request.task.image}
                  alt={request.task.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        {request.task.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Task owner: {request.task.creator}
                      </p>
                    </div>
                    <span className={`badge ${statusStyles[request.status]}`}>
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
                      {request.sentAt}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      {request.location}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyRequests;
