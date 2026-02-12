import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, User } from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';

const Feed = () => {
  const [tasks] = useState([
    {
      id: 1,
      title: 'Help Moving Furniture',
      description: 'Need help moving furniture from my apartment to a new home...',
      location: 'Downtown Seattle, WA',
      startTime: 'Jul 3, 2024 • 2:00 PM',
      endTime: '6:00 PM',
      status: 'moving',
      image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=500',
      creator: {
        name: 'Sarah Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      },
    },
    {
      id: 2,
      title: 'Garden Cleanup',
      description: 'Looking for someone to help clean up my backyard...',
      location: 'Bellevue, WA',
      startTime: 'Jul 8, 2024 • 9:00 AM',
      endTime: '1:00 PM',
      status: 'gardening',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500',
      creator: {
        name: 'Robert Wilson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
      },
    },
    {
      id: 3,
      title: 'Room Painting Project',
      description: 'Need two bedrooms painted. Paint and supplies...',
      location: 'Redmond, WA',
      startTime: 'Jul 7, 2024 • 8:00 AM',
      endTime: '5:00 PM',
      status: 'painting',
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500',
      creator: {
        name: 'Emily Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      },
    },
  ]);

  const statusColors = {
    moving: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    gardening: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    painting: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Feed</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find tasks that need help
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="group overflow-hidden p-0">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={task.image}
                  alt={task.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                  <span className={`badge ${statusColors[task.status]}`}>
                    {task.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {task.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin size={16} className="mr-2" />
                    {task.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock size={16} className="mr-2" />
                    {task.startTime} - {task.endTime}
                  </div>
                </div>

                {/* Creator & Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-700">
                  <div className="flex items-center gap-2">
                    <img
                      src={task.creator.avatar}
                      alt={task.creator.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium">
                      {task.creator.name}
                    </span>
                  </div>
                  <Button size="sm" variant="secondary">
                    Request Help
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
