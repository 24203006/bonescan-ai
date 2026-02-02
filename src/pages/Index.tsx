import { useState } from 'react';
import { Upload, Brain, Sparkles, X } from 'lucide-react';
import { Header } from '@/components/Header';
import { ScanUploader } from '@/components/ScanUploader';
import { AnalysisReport } from '@/components/AnalysisReport';
import { useScanAnalysis } from '@/hooks/useScanAnalysis';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
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
      analyzeScan(imageBase64, 'X-ray');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 relative z-10 max-w-7xl">
        {/* Pinterest-style Hero */}
        {!selectedImage && !analysis && (
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">AI-Powered Analysis</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              X-Ray Fracture Detection
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Upload your X-ray scan for instant AI analysis and detailed diagnostic insights
            </p>
          </div>
        )}

        {/* Pinterest Masonry-style Layout */}
        <div className={`grid gap-6 ${analysis ? 'lg:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
          {/* Upload Pin Card */}
          <div className="animate-fade-in-up">
            <div className="bg-card rounded-3xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-elevated">
              {selectedImage ? (
                <div className="relative">
                  <img 
                    src={selectedImage} 
                    alt="Uploaded scan" 
                    className="w-full h-auto object-cover"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <div className="h-12 w-12 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-sm font-medium text-foreground">Analyzing...</p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleClear}
                    className="absolute top-3 right-3 p-2 rounded-full bg-background/90 hover:bg-background shadow-soft transition-all hover:scale-110"
                  >
                    <X className="h-4 w-4 text-foreground" />
                  </button>
                </div>
              ) : (
                <ScanUploader
                  onImageSelect={handleImageSelect}
                  isAnalyzing={isAnalyzing}
                  selectedImage={selectedImage}
                  onClear={handleClear}
                />
              )}
              
              {/* Action Bar */}
              <div className="p-4 border-t border-border/50">
                {selectedImage && !analysis ? (
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={isAnalyzing}
                    className="w-full gradient-primary shadow-soft hover:shadow-elevated transition-all h-12 text-base font-semibold rounded-full"
                  >
                    <Brain className="h-5 w-5 mr-2" />
                    {isAnalyzing ? 'Analyzing...' : 'Analyze X-Ray'}
                  </Button>
                ) : !selectedImage ? (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground py-2">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm font-medium">Drop or click to upload</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Results Pin Card */}
          {analysis && (
            <div className="animate-fade-in-up delay-100">
              <div className="bg-card rounded-3xl shadow-card overflow-hidden">
                <AnalysisReport analysis={analysis} />
              </div>
            </div>
          )}
        </div>

        {/* Empty State for Results */}
        {!analysis && selectedImage && (
          <div className="mt-6 text-center animate-fade-in-up">
            <p className="text-sm text-muted-foreground">
              Click "Analyze X-Ray" to generate your diagnostic report
            </p>
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="mt-16 py-6 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            ⚕️ For educational purposes only. Consult a healthcare professional for diagnosis.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
