import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import {
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Briefcase,
  Star,
  Shield,
} from 'lucide-react';
import Avatar from '@components/common/Avatar';
import toast from 'react-hot-toast';

const UserProfileDropdown = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/auth/login');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const menuItems = [
    {
      icon: User,
      label: 'My Profile',
      action: () => {
        navigate('/settings');
        setIsOpen(false);
      },
    },
    {
      icon: Briefcase,
      label: 'My Tasks',
      action: () => {
        navigate('/my-tasks');
        setIsOpen(false);
      },
    },
    {
      icon: Settings,
      label: 'Settings',
      action: () => {
        navigate('/settings');
        setIsOpen(false);
      },
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      action: () => {
        toast.info('Help center coming soon!');
        setIsOpen(false);
      },
    },
    {
      icon: LogOut,
      label: 'Sign Out',
      action: handleSignOut,
      danger: true,
    },
  ];

  const userName = user?.fullName || user?.firstName || 'User';
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';
  const userImage = user?.imageUrl;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
      >
        <Avatar
          src={userImage}
          alt={userName}
          size="md"
          fallback={userName[0]}
        />
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform duration-200 hidden sm:block ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 overflow-hidden z-50"
          >
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-200 dark:border-dark-700 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950">
              <div className="flex items-center gap-3 mb-3">
                <Avatar
                  src={userImage}
                  alt={userName}
                  size="lg"
                  fallback={userName[0]}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{userName}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {userEmail}
                  </p>
                </div>
              </div>

              {/* User Stats */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200 dark:border-dark-700">
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tasks</p>
                  <p className="text-sm font-bold text-primary-600 dark:text-primary-400">
                    12
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">
                    8
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                  <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400 flex items-center justify-center gap-0.5">
                    <Star size={12} fill="currentColor" />
                    4.8
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={item.action}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 transition-colors
                      ${
                        item.danger
                          ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Shield size={12} />
                <span>Verified Account</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfileDropdown;
