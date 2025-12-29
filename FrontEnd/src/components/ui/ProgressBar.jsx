/**
 * Modern Progress Bar Component
 * Smooth animations, gradient fills, step indicators
 */
import { motion } from 'framer-motion';

const ProgressBar = ({
  value = 0,
  max = 100,
  variant = 'primary',
  size = 'medium',
  showLabel = false,
  labelPosition = 'right',
  animated = true,
  striped = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-pink to-primary-purple',
    success: 'bg-gradient-to-r from-primary-green to-accent-blue',
    warning: 'bg-gradient-to-r from-accent-orange to-accent-yellow',
    info: 'bg-gradient-to-r from-accent-blue to-primary-purple',
    rainbow: 'bg-gradient-to-r from-primary-pink via-primary-purple to-accent-blue',
  };
  
  const sizes = {
    small: 'h-1.5',
    medium: 'h-2.5',
    large: 'h-4',
  };
  
  const stripedStyle = striped ? 'bg-stripes' : '';
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex-1 bg-gray-100 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.6 : 0, ease: 'easeOut' }}
          className={`h-full rounded-full ${variants[variant]} ${stripedStyle}`}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-text-dark min-w-[3rem] text-right">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};

// Circular Progress Component
export const CircularProgress = ({
  value = 0,
  max = 100,
  size = 80,
  strokeWidth = 8,
  variant = 'primary',
  showValue = true,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  const colors = {
    primary: { start: '#FF69B4', end: '#C77DFF' },
    success: { start: '#06D6A0', end: '#4CC9F0' },
    warning: { start: '#FF9F1C', end: '#FFD60A' },
  };
  
  const gradientId = `gradient-${variant}-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors[variant]?.start || colors.primary.start} />
            <stop offset="100%" stopColor={colors[variant]?.end || colors.primary.end} />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-text-dark">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};

// Step Progress Component
export const StepProgress = ({
  steps = [],
  currentStep = 0,
  variant = 'primary',
  className = '',
}) => {
  const colors = {
    primary: {
      active: 'bg-gradient-to-r from-primary-pink to-primary-purple',
      completed: 'bg-primary-pink',
      pending: 'bg-gray-200',
    },
    success: {
      active: 'bg-gradient-to-r from-primary-green to-accent-blue',
      completed: 'bg-primary-green',
      pending: 'bg-gray-200',
    },
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          {/* Step circle */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: index === currentStep ? 1.1 : 1 }}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center
              transition-all duration-300
              ${index < currentStep ? colors[variant].completed : ''}
              ${index === currentStep ? colors[variant].active : ''}
              ${index > currentStep ? colors[variant].pending : ''}
              ${index <= currentStep ? 'text-white' : 'text-gray-500'}
            `}
          >
            {index < currentStep ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="text-sm font-medium">{index + 1}</span>
            )}
          </motion.div>
          
          {/* Connector line */}
          {index < steps.length - 1 && (
            <div className="w-12 h-1 mx-2 bg-gray-200 rounded overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: index < currentStep ? '100%' : '0%' }}
                transition={{ duration: 0.4 }}
                className={colors[variant].completed + ' h-full'}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export { ProgressBar };
