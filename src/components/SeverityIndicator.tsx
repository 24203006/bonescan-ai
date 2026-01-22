import { cn } from '@/lib/utils';

interface SeverityIndicatorProps {
  severity: string;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const severityConfig: Record<string, { color: string; bgColor: string; label: string }> = {
  normal: { color: 'text-severity-normal', bgColor: 'severity-normal', label: 'Normal' },
  mild: { color: 'text-severity-mild', bgColor: 'severity-mild', label: 'Mild' },
  moderate: { color: 'text-severity-moderate', bgColor: 'severity-moderate', label: 'Moderate' },
  severe: { color: 'text-severity-severe', bgColor: 'severity-severe', label: 'Severe' },
  critical: { color: 'text-severity-critical', bgColor: 'severity-critical', label: 'Critical' },
};

export function SeverityIndicator({ severity, score, size = 'md', showLabel = true }: SeverityIndicatorProps) {
  const config = severityConfig[severity.toLowerCase()] || severityConfig.normal;
  
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "rounded-full animate-pulse",
        config.bgColor,
        sizeClasses[size]
      )} />
      {showLabel && (
        <span className={cn("font-medium", config.color, textSizes[size])}>
          {config.label}
          {score !== undefined && ` (${score}%)`}
        </span>
      )}
    </div>
  );
}

export function SeverityBadge({ severity }: { severity: string }) {
  const config = severityConfig[severity.toLowerCase()] || severityConfig.normal;
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-primary-foreground",
      config.bgColor
    )}>
      {config.label}
    </span>
  );
}
