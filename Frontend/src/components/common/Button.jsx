import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  icon: Icon = null,
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary hover:bg-primary/95 text-primary-text focus:ring-primary/20',
    secondary: 'bg-transparent border border-color text-main hover:bg-hover',
    success: 'bg-primary hover:bg-primary/95 text-primary-text focus:ring-primary/20',
    danger: 'bg-danger hover:bg-danger-dark text-white focus:ring-danger-light',
    warning: 'bg-hover border border-color text-main focus:ring-hover',
    outline: 'border border-color hover:bg-hover text-main',
    ghost: 'hover:bg-hover text-main',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <LoadingSpinner size="sm" color={variant === 'outline' || variant === 'ghost' ? 'dark' : 'white'} />
          <span>Please wait...</span>
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </span>
      )}
    </button>
  );
};

export default Button;
