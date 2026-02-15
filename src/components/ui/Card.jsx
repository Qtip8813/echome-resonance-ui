import clsx from 'clsx';

export function Card({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-white/10 bg-gray-800/50 backdrop-blur-sm shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={clsx('p-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={clsx('p-4 pb-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={clsx('text-lg font-semibold text-white', className)} {...props}>
      {children}
    </h3>
  );
}
