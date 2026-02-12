import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } : {}}
      onClick={onClick}
      className={`
        bg-white dark:bg-dark-800 rounded-xl shadow-soft 
        border border-gray-200 dark:border-dark-700 p-6
        transition-all duration-300
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
