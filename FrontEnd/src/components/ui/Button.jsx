/**
 * Modern Button Component
 * Gradient backgrounds, smooth hover states, loading states
 */
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-button
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;
  
  const variants = {
    primary: `
      bg-gradient-to-r from-primary-pink to-primary-purple
      text-white shadow-md
      hover:shadow-lg hover:brightness-105
      focus:ring-primary-pink
    `,
    secondary: `
      bg-white text-primary-pink
      border-2 border-primary-pink
      hover:bg-primary-pink hover:text-white
      focus:ring-primary-pink
    `,
    ghost: `
      bg-transparent text-primary-pink
      hover:bg-primary-pink/10
      focus:ring-primary-pink
    `,
    soft: `
      bg-gradient-to-r from-background-soft to-background-light
      text-text-dark
      hover:shadow-md
      focus:ring-primary-pink
    `,
    success: `
      bg-gradient-to-r from-primary-green to-accent-blue
      text-white shadow-md
      hover:shadow-lg hover:brightness-105
      focus:ring-primary-green
    `,
    warning: `
      bg-gradient-to-r from-accent-orange to-accent-yellow
      text-white shadow-md
      hover:shadow-lg hover:brightness-105
      focus:ring-accent-orange
    `,
    danger: `
      bg-gradient-to-r from-red-400 to-red-500
      text-white shadow-md
      hover:shadow-lg hover:brightness-105
      focus:ring-red-400
    `,
  };
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm gap-1.5',
    medium: 'px-5 py-2.5 text-base gap-2',
    large: 'px-8 py-3.5 text-lg gap-2.5',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${widthClass}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size={size} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </motion.button>
  );
};

const LoadingSpinner = ({ size }) => {
  const spinnerSizes = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5',
  };
  
  return (
    <svg
      className={`animate-spin ${spinnerSizes[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export default Button;
