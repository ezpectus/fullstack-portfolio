interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`bg-cream-200 dark:bg-gray-700 rounded-lg animate-pulse ${className}`} />
  );
}
