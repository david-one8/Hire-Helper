import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Star } from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import toast from 'react-hot-toast';

const Requests = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      requester: {
        name: 'Sarah Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        rating: 4.8,
        reviews: 18,
      },
      task: 'Computer Setup Help',
      message: "Hi! I'd love to help with your computer setup. I have 5+ years of IT experience...",
      requestedAt: 'Jul 4, 9:00 PM',
      location: 'Within 5 miles',
    },
    {
      id: 2,
      requester: {
        name: 'Emily Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        rating: 5.0,
        reviews: 41,
      },
      task: 'Computer Setup Help',
      message: "I'd be happy to help with your computer setup! I'm a software engineer with experience...",
      requestedAt: 'Jul 4, 4:00 PM',
      location: 'Within 5 miles',
    },
  ]);

  const handleAccept = (id) => {
    setRequests(requests.filter((req) => req.id !== id));
    toast.success('Request accepted!');
  };

  const handleDecline = (id) => {
    setRequests(requests.filter((req) => req.id !== id));
    toast.success('Request declined');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Requests</h1>
        <p className="text-gray-600 dark:text-gray-400">
          People who want to help with your tasks
        </p>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No incoming requests yet
            </p>
          </Card>
        ) : (
          requests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Profile */}
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={request.requester.avatar}
                      alt={request.requester.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">
                          {request.requester.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-yellow-500">
                          <Star size={16} fill="currentColor" />
                          <span className="font-medium">
                            {request.requester.rating}
                          </span>
                          <span className="text-gray-400">
                            ({request.requester.reviews} reviews)
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Requesting for:
                        </p>
                        <p className="font-medium text-primary-600 dark:text-primary-400">
                          {request.task}
                        </p>
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
                          {request.requestedAt}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          {request.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-3 md:min-w-[120px]">
                    <Button
                      variant="secondary"
                      size="sm"
                      fullWidth
                      onClick={() => handleAccept(request.id)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => handleDecline(request.id)}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Requests;
