import { cn } from '@/lib/cn';

export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'fancy-card p-6',
        hover && 'hover-lift cursor-pointer',
        'motion-safe-fade-in',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className }) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className }) {
  return <div className={cn('', className)}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className }) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-border-light dark:border-border-dark', className)}>
      {children}
    </div>
  );
};
