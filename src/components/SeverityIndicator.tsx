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
    lg: 'text-lg',
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className={cn(
          "rounded-full",
          config.bgColor,
          sizeClasses[size]
        )} />
        {/* Pulse ring animation */}
        <div className={cn(
          "absolute inset-0 rounded-full animate-ping opacity-40",
          config.bgColor
        )} />
      </div>
      {showLabel && (
        <span className={cn("font-semibold tracking-tight", config.color, textSizes[size])}>
          {config.label}
          {score !== undefined && (
            <span className="text-muted-foreground font-normal ml-1">({score}%)</span>
          )}
        </span>
      )}
    </div>
  );
}

export function SeverityBadge({ severity }: { severity: string }) {
  const config = severityConfig[severity.toLowerCase()] || severityConfig.normal;
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-primary-foreground transition-all hover:scale-105",
      config.bgColor
    )}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {config.label}
    </span>
  );
}
