import { useCallback, useState } from 'react';
import { Upload, Image, X, Loader2, Scan } from 'lucide-react';
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
      <div className="relative rounded-2xl overflow-hidden glass shadow-card animate-scale-in">
        <div className="relative aspect-square max-h-[500px] overflow-hidden">
          <img 
            src={selectedImage} 
            alt="Uploaded scan" 
            className="w-full h-full object-contain bg-muted/30"
          />
          {isAnalyzing && (
            <div className="absolute inset-0 bg-primary/5 backdrop-blur-sm flex items-center justify-center">
              {/* Scanning overlay effect */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line opacity-80" />
              </div>
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary animate-pulse" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary animate-pulse" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary animate-pulse" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary animate-pulse" />
              
              <div className="relative flex flex-col items-center gap-4 p-6 rounded-2xl glass">
                <div className="relative">
                  <Scan className="h-12 w-12 text-primary animate-pulse" />
                  <div className="absolute inset-0 animate-pulse-glow rounded-full" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">Analyzing Scan</p>
                  <p className="text-sm text-muted-foreground">AI processing in progress...</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {!isAnalyzing && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-3 right-3 shadow-elevated hover-scale"
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
        "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-500 cursor-pointer",
        "flex flex-col items-center justify-center gap-6 min-h-[400px]",
        "hover-lift group",
        isDragOver 
          ? "border-primary bg-primary/5 scale-[1.02] shadow-[0_0_40px_hsl(var(--primary)/0.2)]" 
          : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30"
      )}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden rounded-2xl">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>
      
      <div className={cn(
        "relative p-8 rounded-3xl transition-all duration-500",
        isDragOver 
          ? "bg-primary/15 scale-110" 
          : "bg-secondary/80 group-hover:bg-primary/10 group-hover:scale-105"
      )}>
        {isDragOver ? (
          <Image className="h-14 w-14 text-primary animate-float" />
        ) : (
          <Upload className="h-14 w-14 text-primary transition-transform duration-300 group-hover:-translate-y-1" />
        )}
        {/* Glow effect */}
        <div className={cn(
          "absolute inset-0 rounded-3xl transition-opacity duration-500",
          isDragOver ? "opacity-100" : "opacity-0 group-hover:opacity-50",
          "shadow-[0_0_60px_hsl(var(--primary)/0.4)]"
        )} />
      </div>
      
      <div className="text-center relative z-10">
        <h3 className="text-xl font-semibold text-foreground mb-2 transition-colors">
          {isDragOver ? "Drop your scan here" : "Upload Medical Scan"}
        </h3>
        <p className="text-muted-foreground">
          Drag & drop or <span className="text-primary font-medium">click to browse</span>
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded-md bg-muted">X-ray</span>
          <span className="px-2 py-1 rounded-md bg-muted">CT Scan</span>
          <span className="px-2 py-1 rounded-md bg-muted">MRI</span>
        </div>
      </div>
    </div>
  );
}
