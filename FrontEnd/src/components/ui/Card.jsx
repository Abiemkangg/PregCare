/**
 * Modern Card Component
 * Soft shadows, rounded corners, hover effects with Framer Motion
 */
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  variant = 'default',
  hover = true,
  padding = 'normal',
  onClick,
  ...props
}) => {
  const baseStyles = 'rounded-card bg-white transition-all duration-300';
  
  const variants = {
    default: 'shadow-card',
    elevated: 'shadow-card-hover',
    outlined: 'border border-gray-100 shadow-sm',
    gradient: 'bg-gradient-to-br from-white to-background-soft shadow-card',
    pastel: 'bg-gradient-to-br from-background-card to-background-soft shadow-card',
  };
  
  const paddings = {
    none: '',
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8',
  };
  
  const hoverStyles = hover ? 'hover:shadow-card-hover hover:-translate-y-1' : '';
  const clickStyles = onClick ? 'cursor-pointer' : '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={hover ? { scale: 1.01 } : {}}
      whileTap={onClick ? { scale: 0.99 } : {}}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${paddings[padding]}
        ${hoverStyles}
        ${clickStyles}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
