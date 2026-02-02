import { useCallback, useState } from 'react';
import { Upload, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScanUploaderProps {
  onImageSelect: (file: File, base64: string) => void;
  isAnalyzing: boolean;
  selectedImage: string | null;
  onClear: () => void;
}

export function ScanUploader({ onImageSelect, isAnalyzing }: ScanUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      onImageSelect(file, base64);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative rounded-3xl p-10 transition-all duration-300 cursor-pointer",
        "flex flex-col items-center justify-center gap-5 min-h-[320px]",
        "hover:shadow-card group",
        isDragOver 
          ? "bg-primary/5 border-2 border-dashed border-primary" 
          : "bg-secondary/30 hover:bg-secondary/50"
      )}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
        disabled={isAnalyzing}
      />
      
      <div className={cn(
        "p-6 rounded-full transition-all duration-300",
        isDragOver 
          ? "bg-primary/20 scale-110" 
          : "bg-secondary group-hover:bg-primary/10 group-hover:scale-105"
      )}>
        {isDragOver ? (
          <Image className="h-10 w-10 text-primary" />
        ) : (
          <Upload className="h-10 w-10 text-primary" />
        )}
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {isDragOver ? "Drop your X-ray" : "Upload X-Ray Scan"}
        </h3>
        <p className="text-sm text-muted-foreground">
          Drag & drop or <span className="text-primary font-medium">browse</span>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Supports JPG, PNG, DICOM formats
        </p>
      </div>
    </div>
  );
}
