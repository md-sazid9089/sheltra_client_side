import { cn } from '@/lib/cn';

export function SectionHeading({ title, subtitle, center = false, className }) {
  return (
    <div className={cn(center && 'text-center', 'mb-8', className)}>
      <h2 className="text-section-title text-text-primary dark:text-text-darkPrimary">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-text-secondary dark:text-text-darkSecondary text-lg max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
