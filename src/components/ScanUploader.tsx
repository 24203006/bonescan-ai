import { useCallback, useState } from 'react';
import { Upload, Image, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ScanUploaderProps {
  onImageSelect: (file: File, base64: string) => void;
  isAnalyzing: boolean;
  selectedImage: string | null;
  onClear: () => void;
}

export function ScanUploader({ onImageSelect, isAnalyzing, selectedImage, onClear }: ScanUploaderProps) {
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

  if (selectedImage) {
    return (
      <div className="relative rounded-xl overflow-hidden shadow-card bg-card">
        <div className="relative aspect-square max-h-[500px] overflow-hidden">
          <img 
            src={selectedImage} 
            alt="Uploaded scan" 
            className="w-full h-full object-contain bg-muted"
          />
          {isAnalyzing && (
            <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center">
              <div className="relative w-full h-full overflow-hidden">
                <div className="absolute inset-x-0 h-1 bg-primary/50 animate-scan-line" />
              </div>
              <div className="absolute flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <span className="text-sm font-medium text-primary">Analyzing scan...</span>
              </div>
            </div>
          )}
        </div>
        {!isAnalyzing && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-3 right-3 shadow-elevated"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 cursor-pointer",
        "flex flex-col items-center justify-center gap-4 min-h-[400px]",
        isDragOver 
          ? "border-primary bg-primary/5 scale-[1.02]" 
          : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50"
      )}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      <div className={cn(
        "p-6 rounded-2xl transition-all duration-300",
        isDragOver ? "bg-primary/10" : "bg-secondary"
      )}>
        {isDragOver ? (
          <Image className="h-12 w-12 text-primary" />
        ) : (
          <Upload className="h-12 w-12 text-primary" />
        )}
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">
          {isDragOver ? "Drop your scan here" : "Upload Medical Scan"}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Drag & drop or click to browse
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Supports X-ray, CT, and MRI images (PNG, JPG, DICOM)
        </p>
      </div>
    </div>
  );
}
