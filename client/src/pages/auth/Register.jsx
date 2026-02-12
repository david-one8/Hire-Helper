import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

const Register = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl p-8">
        <div className="mb-6 text-center lg:text-left">
          <h2 className="text-2xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Join the Hire-a-Helper community
          </p>
        </div>
        
        <SignUp
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none bg-transparent',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton:
                'bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-600',
              formButtonPrimary:
                'bg-primary-600 hover:bg-primary-700 text-sm normal-case',
              footerActionLink: 'text-primary-600 hover:text-primary-700',
              identityPreviewEditButton: 'text-primary-600',
              formFieldInput:
                'bg-white dark:bg-dark-700 border-gray-300 dark:border-dark-600 text-gray-900 dark:text-gray-100',
            },
          }}
          redirectUrl="/feed"
          signInUrl="/auth/login"
        />
      </div>
    </motion.div>
  );
};

export default Register;
