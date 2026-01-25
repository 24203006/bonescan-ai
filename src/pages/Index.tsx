import { useState } from 'react';
import { Scan, Brain, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { ScanUploader } from '@/components/ScanUploader';
import { ScanTypeSelector } from '@/components/ScanTypeSelector';
import { AnalysisReport } from '@/components/AnalysisReport';
import { useScanAnalysis } from '@/hooks/useScanAnalysis';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [scanType, setScanType] = useState('X-ray');
  const { isAnalyzing, analysis, analyzeScan, reset } = useScanAnalysis();

  const handleImageSelect = (file: File, base64: string) => {
    setSelectedImage(URL.createObjectURL(file));
    setImageBase64(base64);
    reset();
  };

  const handleClear = () => {
    setSelectedImage(null);
    setImageBase64(null);
    reset();
  };

  const handleAnalyze = () => {
    if (imageBase64) {
      analyzeScan(imageBase64, scanType);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      </div>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        {!selectedImage && !analysis && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle mb-6 animate-fade-in-up">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Powered by Vision AI</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in-up delay-100">
              AI-Powered Bone Fracture
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Detection & Analysis
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-200">
              Upload medical scans for instant AI analysis. Detect fractures, assess severity, 
              and receive specialist recommendations.
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Section */}
          <div className="space-y-4 animate-fade-in-up delay-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 glass-subtle px-4 py-2 rounded-full">
                <Scan className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground text-sm">Medical Scan</span>
              </div>
              <ScanTypeSelector value={scanType} onChange={setScanType} />
            </div>
            
            <ScanUploader
              onImageSelect={handleImageSelect}
              isAnalyzing={isAnalyzing}
              selectedImage={selectedImage}
              onClear={handleClear}
            />
            
            {selectedImage && !analysis && (
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing}
                className="w-full gradient-primary shadow-soft hover:shadow-elevated hover-scale transition-all h-14 text-base font-semibold"
                size="lg"
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Analyzing Scan...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Analyze with AI
                  </span>
                )}
              </Button>
            )}
          </div>

          {/* Results Section */}
          <div className="animate-fade-in-up delay-400">
            {analysis ? (
              <AnalysisReport analysis={analysis} />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] rounded-2xl border-2 border-dashed border-muted-foreground/10 glass-subtle">
                <div className="text-center p-8">
                  <div className="relative mx-auto w-fit mb-6">
                    <div className="p-6 rounded-2xl bg-muted/50">
                      <Brain className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-muted-foreground/20 animate-pulse" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-lg">Analysis Report</h3>
                  <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">
                    Upload a medical scan and click "Analyze with AI" to generate a detailed diagnostic report
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 glass-subtle relative z-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2 font-medium">
            ⚕️ Medical Disclaimer
          </p>
          <p className="max-w-2xl mx-auto leading-relaxed">
            This tool is for educational and screening purposes only. All findings must be verified by a qualified healthcare professional before any diagnosis or treatment.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
