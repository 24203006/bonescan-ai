import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ScanTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const scanTypes = [
  { value: 'X-ray', label: 'X-Ray' },
  { value: 'CT', label: 'CT Scan' },
  { value: 'MRI', label: 'MRI' },
];

export function ScanTypeSelector({ value, onChange }: ScanTypeSelectorProps) {
  return (
    <div className="flex gap-2">
      {scanTypes.map((type) => (
        <Button
          key={type.value}
          variant={value === type.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(type.value)}
          className={cn(
            "transition-all",
            value === type.value && "shadow-soft"
          )}
        >
          {type.label}
        </Button>
      ))}
    </div>
  );
}
