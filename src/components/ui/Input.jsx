import clsx from 'clsx';

export function Input({ className, ...props }) {
  return (
    <input
      className={clsx(
        'w-full rounded-lg border border-white/20 bg-gray-800/50 px-4 py-2 text-white',
        'placeholder:text-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={clsx(
        'w-full rounded-lg border border-white/20 bg-gray-800/50 px-4 py-2 text-white',
        'placeholder:text-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed resize-none',
        className
      )}
      {...props}
    />
  );
}
