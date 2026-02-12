import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const AuthLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (isSignedIn) {
    return <Navigate to="/feed" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200/20 dark:bg-primary-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-200/20 dark:bg-secondary-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Briefcase className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                HireHelper
              </h1>
              <p className="text-gray-600 dark:text-gray-400">On-Demand Task Assistance</p>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Connect, Collaborate, Complete
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Find help for your tasks or offer your skills to help others. 
            Join our community of helpers and task creators today.
          </p>

          <div className="space-y-4">
            {[
              { icon: '🎯', text: 'Post tasks and find skilled helpers' },
              { icon: '🤝', text: 'Connect with trusted community members' },
              { icon: '⚡', text: 'Get things done quickly and efficiently' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
