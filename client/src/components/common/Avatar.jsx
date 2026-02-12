import React from 'react';
import { User } from 'lucide-react';

const Avatar = ({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  className = '',
  online = false,
}) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  };

  const [imageError, setImageError] = React.useState(false);

  const handleError = () => {
    setImageError(true);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`
          ${sizes[size]} 
          rounded-full overflow-hidden 
          bg-gradient-to-br from-primary-400 to-primary-600
          flex items-center justify-center
        `}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            onError={handleError}
            className="w-full h-full object-cover"
          />
        ) : fallback ? (
          <span className="text-white font-medium text-sm">
            {fallback}
          </span>
        ) : (
          <User className="text-white" size={size === 'xs' ? 12 : size === 'sm' ? 16 : 20} />
        )}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-dark-800 rounded-full" />
      )}
    </div>
  );
};

export default Avatar;
