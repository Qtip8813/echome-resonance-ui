import clsx from 'clsx';

const variants = {
  default: 'bg-purple-600 hover:bg-purple-700 text-white',
  destructive: 'bg-red-600 hover:bg-red-700 text-white',
  outline: 'border border-white/20 bg-transparent hover:bg-white/10 text-white',
  ghost: 'bg-transparent hover:bg-white/10 text-white',
  secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
};

const sizes = {
  default: 'px-4 py-2 text-sm',
  sm: 'px-3 py-1.5 text-xs',
  lg: 'px-6 py-3 text-base',
  icon: 'p-2',
};

export function Button({
  children,
  className,
  variant = 'default',
  size = 'default',
  disabled,
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
