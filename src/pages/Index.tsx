import { useState } from 'react';
import { Scan, ShieldCheck, Brain, Zap } from 'lucide-react';
import { Header } from '@/components/Header';
import { ScanUploader } from '@/components/ScanUploader';
import { ScanTypeSelector } from '@/components/ScanTypeSelector';
import { AnalysisReport } from '@/components/AnalysisReport';
import { useScanAnalysis } from '@/hooks/useScanAnalysis';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        {!selectedImage && !analysis && (
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              AI-Powered Bone Fracture Detection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Upload medical scans for instant AI analysis. Detect fractures, assess severity, 
              and receive specialist recommendations powered by advanced vision AI.
            </p>
            
          </div>
        )}

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scan className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Medical Scan</h3>
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
                className="w-full gradient-primary shadow-soft hover:shadow-elevated transition-all"
                size="lg"
              >
                {isAnalyzing ? (
                  <>Analyzing Scan...</>
                ) : (
                  <>
                    <Brain className="h-5 w-5 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>
            )}

          </div>

          {/* Results Section */}
          <div>
            {analysis ? (
              <AnalysisReport analysis={analysis} />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] rounded-xl border-2 border-dashed border-muted-foreground/20">
                <div className="text-center p-8">
                  <div className="p-4 rounded-full bg-muted w-fit mx-auto mb-4">
                    <Brain className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Analysis Report</h3>
                  <p className="text-sm text-muted-foreground max-w-[250px]">
                    Upload a medical scan and click "Analyze with AI" to generate a detailed report
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-6 bg-card/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Disclaimer:</strong> This tool is for educational and screening purposes only.
          </p>
          <p>All findings must be verified by a qualified healthcare professional before any diagnosis or treatment.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
