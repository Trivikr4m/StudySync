import React from 'react';

const Skeleton = ({ variant = 'text', className = '' }) => {
  const baseClasses = 'bg-slate-200 dark:bg-slate-700 animate-pulse rounded';

  if (variant === 'text') {
    return <div className={`h-4 w-full ${baseClasses} ${className}`} />;
  }

  if (variant === 'avatar') {
    return <div className={`h-10 w-10 rounded-full ${baseClasses} ${className}`} />;
  }

  if (variant === 'card') {
    return (
      <div className={`p-5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-card shadow-sm ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
            <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
          <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
          <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  return <div className={`${baseClasses} ${className}`} />;
};

export default Skeleton;
