/**
 * Modern Badge Component
 * Visual indicators, status badges, and achievement badges
 */
import { motion } from 'framer-motion';

const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  icon,
  pulse = false,
  glow = false,
  className = '',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-full
    transition-all duration-200
  `;
  
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-gradient-to-r from-primary-pink/20 to-primary-purple/20 text-primary-pink',
    success: 'bg-gradient-to-r from-primary-green/20 to-accent-blue/20 text-primary-green',
    warning: 'bg-gradient-to-r from-accent-orange/20 to-accent-yellow/20 text-accent-orange',
    danger: 'bg-red-100 text-red-600',
    info: 'bg-accent-blue/20 text-accent-blue',
    // Solid variants for achievement badges
    solidPrimary: 'bg-gradient-to-r from-primary-pink to-primary-purple text-white shadow-sm',
    solidSuccess: 'bg-gradient-to-r from-primary-green to-accent-blue text-white shadow-sm',
    solidWarning: 'bg-gradient-to-r from-accent-orange to-accent-yellow text-white shadow-sm',
    solidPurple: 'bg-gradient-to-r from-primary-purple to-primary-pink text-white shadow-sm',
    // Pastel soft variants
    pastelPink: 'bg-pink-50 text-pink-600 border border-pink-200',
    pastelPurple: 'bg-purple-50 text-purple-600 border border-purple-200',
    pastelGreen: 'bg-green-50 text-green-600 border border-green-200',
    pastelBlue: 'bg-blue-50 text-blue-600 border border-blue-200',
    pastelOrange: 'bg-orange-50 text-orange-600 border border-orange-200',
  };
  
  const sizes = {
    small: 'px-2 py-0.5 text-xs gap-1',
    medium: 'px-3 py-1 text-sm gap-1.5',
    large: 'px-4 py-1.5 text-base gap-2',
  };
  
  const glowStyles = glow ? 'shadow-lg' : '';
  
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${glowStyles}
        ${className}
      `}
      {...props}
    >
      {pulse && <PulsingDot variant={variant} />}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.span>
  );
};

const PulsingDot = ({ variant }) => {
  const dotColors = {
    default: 'bg-gray-500',
    primary: 'bg-primary-pink',
    success: 'bg-primary-green',
    warning: 'bg-accent-orange',
    danger: 'bg-red-500',
    info: 'bg-accent-blue',
  };
  
  return (
    <span className="relative flex h-2 w-2 mr-1">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColors[variant] || dotColors.default} opacity-75`} />
      <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant] || dotColors.default}`} />
    </span>
  );
};

// Achievement Badge - Special styled badge for achievements/medals
export const AchievementBadge = ({
  title,
  icon,
  color = 'from-accent-yellow to-accent-orange',
  size = 'medium',
  locked = false,
  className = '',
}) => {
  const sizes = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20',
  };
  
  const iconSizes = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-10 h-10',
  };
  
  return (
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={`
        ${sizes[size]}
        rounded-full flex items-center justify-center
        ${locked ? 'bg-gray-200' : `bg-gradient-to-br ${color}`}
        shadow-lg relative overflow-hidden
        ${className}
      `}
    >
      {locked ? (
        <svg className={`${iconSizes[size]} text-gray-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ) : (
        <>
          {icon || (
            <svg className={`${iconSizes[size]} text-white`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-50" />
        </>
      )}
      {title && (
        <span className="sr-only">{title}</span>
      )}
    </motion.div>
  );
};

export default Badge;
