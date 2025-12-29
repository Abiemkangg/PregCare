/**
 * Shimmer/Skeleton Loading Component
 * Smooth loading states with animated gradients
 */

const Shimmer = ({
  width = '100%',
  height = '1rem',
  rounded = 'md',
  className = '',
}) => {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
    card: 'rounded-card',
  };
  
  return (
    <div
      className={`
        animate-shimmer
        bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100
        bg-[length:200%_100%]
        ${roundedClasses[rounded]}
        ${className}
      `}
      style={{ width, height }}
    />
  );
};

// Card Skeleton for loading states
export const CardSkeleton = ({ className = '' }) => (
  <div className={`bg-white rounded-card shadow-card p-6 ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <Shimmer width="48px" height="48px" rounded="full" />
      <div className="flex-1 space-y-2">
        <Shimmer width="60%" height="1rem" />
        <Shimmer width="40%" height="0.75rem" />
      </div>
    </div>
    <div className="space-y-3">
      <Shimmer width="100%" height="0.75rem" />
      <Shimmer width="90%" height="0.75rem" />
      <Shimmer width="70%" height="0.75rem" />
    </div>
  </div>
);

// List Item Skeleton
export const ListItemSkeleton = ({ count = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center space-x-3 p-3">
        <Shimmer width="40px" height="40px" rounded="full" />
        <div className="flex-1 space-y-2">
          <Shimmer width="70%" height="0.875rem" />
          <Shimmer width="40%" height="0.75rem" />
        </div>
      </div>
    ))}
  </div>
);

// Profile Skeleton
export const ProfileSkeleton = ({ className = '' }) => (
  <div className={`flex flex-col items-center space-y-4 ${className}`}>
    <Shimmer width="80px" height="80px" rounded="full" />
    <Shimmer width="150px" height="1.25rem" />
    <Shimmer width="100px" height="0.875rem" />
  </div>
);

// Chat Message Skeleton
export const ChatMessageSkeleton = ({ isUser = false, className = '' }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${className}`}>
    <div className={`max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
      <div className={`
        p-4 rounded-2xl space-y-2
        ${isUser ? 'bg-primary-pink/10 rounded-br-md' : 'bg-gray-100 rounded-bl-md'}
      `}>
        <Shimmer width="100%" height="0.75rem" />
        <Shimmer width="80%" height="0.75rem" />
        <Shimmer width="60%" height="0.75rem" />
      </div>
    </div>
  </div>
);

// Grid Skeleton
export const GridSkeleton = ({ cols = 3, rows = 2, className = '' }) => (
  <div className={`grid grid-cols-${cols} gap-4 ${className}`}>
    {Array.from({ length: cols * rows }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

// Stats Skeleton
export const StatsSkeleton = ({ className = '' }) => (
  <div className={`bg-white rounded-card shadow-card p-6 ${className}`}>
    <Shimmer width="60px" height="60px" rounded="xl" className="mb-4" />
    <Shimmer width="80px" height="1.5rem" className="mb-2" />
    <Shimmer width="120px" height="0.875rem" />
  </div>
);

export default Shimmer;
