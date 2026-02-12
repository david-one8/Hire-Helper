import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import { EmptyMyTasksState } from '@components/common/EmptyStates';

const MyTasks = () => {
  const navigate = useNavigate();

  const myTasks = [
    {
      id: 1,
      title: 'Computer Setup Help',
      description: 'Need help setting up my new home office computer...',
      location: 'Your Location',
      date: 'Jul 8, 2024',
      time: '3:00 PM - 6:00 PM',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500',
    },
    {
      id: 2,
      title: 'Car Wash & Detail',
      description: 'Looking for someone to wash and detail my car...',
      location: 'Your Location',
      date: 'Jul 8, 2024',
      time: '10:00 AM - 12:30 PM',
      status: 'in progress',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500',
    },
  ];

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
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="overflow-hidden">
                <div className="flex gap-4">
                  <img
                    src={task.image}
                    alt={task.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold">{task.title}</h3>
                      <span
                        className={`badge ${
                          task.status === 'active'
                            ? 'badge-active'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                      <p>📍 {task.location}</p>
                      <p>📅 {task.date} • {task.time}</p>
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
