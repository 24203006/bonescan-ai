import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnalysisResult {
  scanAnalysis: {
    scanType: string;
    bodyRegion: string;
    imageQuality: string;
  };
  findings: Array<{
    type: string;
    location: string;
    description: string;
    severity: string;
    confidence: number;
  }>;
  overallSeverity: string;
  severityScore: number;
  recommendations: {
    immediateAction: string;
    specialistReferral: {
      type: string;
      urgency: string;
      reason: string;
    };
    suggestedMedications: Array<{
      name: string;
      purpose: string;
      note: string;
    }>;
    additionalTests: string[];
  };
  summary: string;
  disclaimer: string;
}

export function useScanAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeScan = async (imageBase64: string, scanType: string) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-scan', {
        body: { imageBase64, scanType },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.analysis) {
        // Handle parse error from backend
        if (data.analysis.parseError) {
          toast.warning('Analysis completed but response format was unexpected');
          console.log('Raw AI response:', data.analysis.rawResponse);
        }
        setAnalysis(data.analysis);
        toast.success('Scan analysis complete');
      } else {
        throw new Error('No analysis data received');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze scan';
      setError(message);
      toast.error(message);
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setAnalysis(null);
    setError(null);
  };

  return {
    isAnalyzing,
    analysis,
    error,
    analyzeScan,
    reset,
  };
}
