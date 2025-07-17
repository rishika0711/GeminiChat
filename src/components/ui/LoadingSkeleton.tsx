import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'message' | 'chatroom' | 'text';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  count = 1,
  className = '',
}) => {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <div key={i} className="animate-pulse">
      {variant === 'message' && (
        <div className="flex space-x-3 p-4">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      )}
      
      {variant === 'chatroom' && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      )}
      
      {variant === 'text' && (
        <div className={`h-4 bg-gray-300 dark:bg-gray-600 rounded ${className}`}></div>
      )}
    </div>
  ));
  
  return <>{skeletons}</>;
};