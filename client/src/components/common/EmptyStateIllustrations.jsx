import React from 'react';

// No Tasks Illustration
export const NoTasksIllustration = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="currentColor" className="text-primary-100 dark:text-primary-900" />
    <rect x="60" y="70" width="80" height="60" rx="4" fill="currentColor" className="text-primary-200 dark:text-primary-800" />
    <line x1="70" y1="85" x2="130" y2="85" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary-400 dark:text-primary-600" />
    <line x1="70" y1="100" x2="110" y2="100" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary-400 dark:text-primary-600" />
    <line x1="70" y1="115" x2="120" y2="115" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary-400 dark:text-primary-600" />
    <circle cx="150" cy="50" r="8" fill="currentColor" className="text-yellow-400" />
    <circle cx="40" cy="140" r="6" fill="currentColor" className="text-blue-400" />
    <circle cx="160" cy="150" r="5" fill="currentColor" className="text-green-400" />
  </svg>
);

// No Requests Illustration
export const NoRequestsIllustration = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="currentColor" className="text-secondary-100 dark:text-secondary-900" />
    <path d="M100 60C77.9086 60 60 77.9086 60 100C60 122.091 77.9086 140 100 140C122.091 140 140 122.091 140 100C140 77.9086 122.091 60 100 60Z" stroke="currentColor" strokeWidth="4" className="text-secondary-400 dark:text-secondary-600" />
    <path d="M85 100L95 110L115 90" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-secondary-500 dark:text-secondary-500" />
    <circle cx="45" cy="55" r="6" fill="currentColor" className="text-pink-400" />
    <circle cx="155" cy="145" r="7" fill="currentColor" className="text-purple-400" />
  </svg>
);

// No Notifications Illustration
export const NoNotificationsIllustration = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="currentColor" className="text-gray-100 dark:text-dark-800" />
    <path d="M100 60C88.9543 60 80 68.9543 80 80V95C80 106.046 71.0457 115 60 115H140C128.954 115 120 106.046 120 95V80C120 68.9543 111.046 60 100 60Z" fill="currentColor" className="text-gray-300 dark:text-dark-700" />
    <path d="M90 115C90 120.523 94.4772 125 100 125C105.523 125 110 120.523 110 115" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-gray-400 dark:text-dark-600" />
    <line x1="80" y1="80" x2="120" y2="80" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-gray-400 dark:text-dark-600" />
  </svg>
);

// No Results Illustration
export const NoResultsIllustration = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="currentColor" className="text-orange-100 dark:text-orange-900" />
    <circle cx="85" cy="90" r="25" stroke="currentColor" strokeWidth="4" className="text-orange-400 dark:text-orange-600" />
    <line x1="105" y1="110" x2="125" y2="130" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-orange-400 dark:text-orange-600" />
    <line x1="70" y1="80" x2="100" y2="100" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-orange-500 dark:text-orange-500" />
  </svg>
);

// Connection Error Illustration
export const ConnectionErrorIllustration = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="currentColor" className="text-red-100 dark:text-red-900" />
    <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="4" className="text-red-400 dark:text-red-600" />
    <line x1="85" y1="85" x2="115" y2="115" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-red-500" />
    <line x1="115" y1="85" x2="85" y2="115" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-red-500" />
    <path d="M50 150Q100 130 150 150" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="5,5" className="text-red-300 dark:text-red-700" />
  </svg>
);
