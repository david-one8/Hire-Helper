import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TaskCard from '@components/tasks/TaskCard';
import TaskDetailModal from '@components/tasks/TaskDetailModal';
import toast from 'react-hot-toast';

const Feed = () => {
  const [tasks] = useState([
    {
      id: 1,
      title: 'Help Moving Furniture',
      description: 'Need help moving furniture from my apartment to a new home. Heavy lifting required. Will provide all necessary equipment and refreshments.',
      location: 'Downtown Seattle, WA',
      startTime: 'Jul 3, 2024 • 2:00 PM',
      endTime: '6:00 PM',
      status: 'moving',
      budget: 150,
      image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=500',
      creator: {
        name: 'Sarah Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        rating: 4.8,
        reviews: 18,
        bio: 'Reliable and friendly. Always ready to help!',
      },
    },
    {
      id: 2,
      title: 'Garden Cleanup',
      description: 'Looking for someone to help clean up my backyard and trim hedges. Basic gardening tools will be provided.',
      location: 'Bellevue, WA',
      startTime: 'Jul 8, 2024 • 9:00 AM',
      endTime: '1:00 PM',
      status: 'gardening',
      budget: 100,
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500',
      creator: {
        name: 'Robert Wilson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
        rating: 4.9,
        reviews: 25,
        bio: 'Home improvement enthusiast with 10+ years experience.',
      },
    },
    {
      id: 3,
      title: 'Room Painting Project',
      description: 'Need two bedrooms painted. Paint and supplies provided. Looking for someone with painting experience.',
      location: 'Redmond, WA',
      startTime: 'Jul 7, 2024 • 8:00 AM',
      endTime: '5:00 PM',
      status: 'painting',
      budget: 200,
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500',
      creator: {
        name: 'Emily Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        rating: 5.0,
        reviews: 41,
        bio: 'Professional project manager, organized and detail-oriented.',
      },
    },
  ]);

  // Modal state
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle viewing task details
  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Handle request from modal
  const handleRequest = (task, message) => {
    console.log('Request sent for:', task.title);
    console.log('Message:', message);
    
    // Here you would make an API call to send the request
    // Example:
    // await requestService.sendRequest({
    //   taskId: task.id,
    //   message: message
    // });
    
    toast.success(`Request sent to ${task.creator.name}!`);
  };

  // Handle quick request from card button
  const handleQuickRequest = (task) => {
    toast.success(`Opening request form for "${task.title}"`);
    handleViewDetails(task); // Open modal for detailed request
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
            <TaskCard
              task={task}
              onViewDetails={handleViewDetails}
              onRequest={handleQuickRequest}
              showRequestButton={true}
            />
          </motion.div>
        ))}
      </div>

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
