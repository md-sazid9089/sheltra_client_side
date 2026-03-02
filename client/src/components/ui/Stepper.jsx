import { cn } from '@/lib/cn';

export function Stepper({ steps, className }) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      {steps.map((step, index) => (
        <div
          key={index}
          className="relative flex flex-col items-center text-center motion-safe-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center text-lg font-bold mb-4 shadow-soft">
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className="hidden lg:block absolute top-6 left-[calc(50%+24px)] w-[calc(100%-48px)] h-0.5 bg-border-light dark:bg-border-dark" />
          )}
          <h3 className="font-semibold text-text-primary dark:text-text-darkPrimary mb-1">
            {step.title}
          </h3>
          <p className="text-sm text-text-secondary dark:text-text-darkSecondary">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
}
