import { FileText, AlertTriangle, Pill, UserCheck, Stethoscope, Activity, Bone, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SeverityIndicator, SeverityBadge } from './SeverityIndicator';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';

interface Finding {
  type: string;
  location: string;
  description: string;
  severity: string;
  confidence: number;
}

interface AnalysisResult {
  scanAnalysis: {
    scanType: string;
    bodyRegion: string;
    imageQuality: string;
  };
  findings: Finding[];
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

interface AnalysisReportProps {
  analysis: AnalysisResult;
}

export function AnalysisReport({ analysis }: AnalysisReportProps) {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    const addWrappedText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += fontSize * 0.5;
      });
      y += 2;
    };

    const addSection = (title: string) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      y += 5;
      doc.setDrawColor(230, 73, 78);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 7;
      addWrappedText(title, 12, true);
      y += 2;
    };

    // Header
    doc.setFillColor(230, 73, 78);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('OsteoVision', margin, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('X-Ray Fracture Analysis Report', margin, 26);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin - 60, 26);
    
    doc.setTextColor(0, 0, 0);
    y = 50;

    // Scan Information
    addSection('SCAN INFORMATION');
    addWrappedText(`Scan Type: ${analysis.scanAnalysis.scanType}`);
    addWrappedText(`Body Region: ${analysis.scanAnalysis.bodyRegion}`);
    addWrappedText(`Image Quality: ${analysis.scanAnalysis.imageQuality}`);

    // Overall Assessment
    addSection('OVERALL ASSESSMENT');
    const severityColor = getSeverityColor(analysis.overallSeverity);
    doc.setTextColor(severityColor.r, severityColor.g, severityColor.b);
    addWrappedText(`Severity: ${analysis.overallSeverity.toUpperCase()} (Score: ${analysis.severityScore}/100)`, 14, true);
    doc.setTextColor(0, 0, 0);

    // Summary
    addSection('SUMMARY');
    addWrappedText(analysis.summary);

    // Findings
    if (analysis.findings.length > 0) {
      addSection('DETAILED FINDINGS');
      analysis.findings.forEach((finding, index) => {
        addWrappedText(`${index + 1}. ${finding.type}`, 11, true);
        addWrappedText(`   Location: ${finding.location}`);
        addWrappedText(`   Description: ${finding.description}`);
        addWrappedText(`   Severity: ${finding.severity} | Confidence: ${(finding.confidence * 100).toFixed(0)}%`);
        y += 3;
      });
    }

    // Specialist Referral
    addSection('SPECIALIST REFERRAL');
    addWrappedText(`Recommended: ${analysis.recommendations.specialistReferral.type}`, 11, true);
    addWrappedText(`Urgency: ${analysis.recommendations.specialistReferral.urgency}`);
    addWrappedText(`Reason: ${analysis.recommendations.specialistReferral.reason}`);

    // Medications
    addSection('SUGGESTED MEDICATIONS');
    analysis.recommendations.suggestedMedications.forEach((med) => {
      addWrappedText(`• ${med.name} - ${med.purpose}`, 10, true);
      addWrappedText(`  Note: ${med.note}`);
    });

    // Immediate Action
    addSection('IMMEDIATE ACTION REQUIRED');
    addWrappedText(analysis.recommendations.immediateAction);
    
    if (analysis.recommendations.additionalTests.length > 0) {
      y += 3;
      addWrappedText('Additional Tests Recommended:', 10, true);
      analysis.recommendations.additionalTests.forEach((test) => {
        addWrappedText(`• ${test}`);
      });
    }

    // Disclaimer
    addSection('DISCLAIMER');
    doc.setTextColor(150, 100, 0);
    addWrappedText(analysis.disclaimer, 9);
    doc.setTextColor(0, 0, 0);

    // Footer
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
      doc.text('This report is for screening purposes only. Consult a healthcare professional.', pageWidth / 2, 295, { align: 'center' });
    }

    doc.save(`xray-analysis-report-${Date.now()}.pdf`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'normal': return { r: 34, g: 197, b: 94 };
      case 'mild': return { r: 132, g: 204, b: 22 };
      case 'moderate': return { r: 234, g: 179, b: 8 };
      case 'severe': return { r: 249, g: 115, b: 22 };
      case 'critical': return { r: 239, g: 68, b: 68 };
      default: return { r: 0, g: 0, b: 0 };
    }
  };

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full gradient-primary shadow-soft">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Analysis Report</h2>
            <p className="text-xs text-muted-foreground">AI-Generated Insights</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownloadPDF} 
          className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
        >
          <Download className="h-4 w-4 mr-1.5" />
          Save
        </Button>
      </div>

      {/* Overall Severity */}
      <div className={cn(
        "p-4 rounded-2xl",
        analysis.overallSeverity.toLowerCase() === 'normal' && 'bg-severity-normal/10',
        analysis.overallSeverity.toLowerCase() === 'mild' && 'bg-severity-mild/10',
        analysis.overallSeverity.toLowerCase() === 'moderate' && 'bg-severity-moderate/10',
        analysis.overallSeverity.toLowerCase() === 'severe' && 'bg-severity-severe/10',
        analysis.overallSeverity.toLowerCase() === 'critical' && 'bg-severity-critical/10',
      )}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Assessment</p>
            <SeverityIndicator 
              severity={analysis.overallSeverity} 
              score={analysis.severityScore} 
              size="lg" 
            />
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Region</p>
            <p className="font-semibold text-foreground text-sm">{analysis.scanAnalysis.bodyRegion}</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-2xl bg-secondary/30">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-4 w-4 text-primary" />
          <p className="font-semibold text-foreground text-sm">Summary</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Findings */}
      {analysis.findings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Bone className="h-4 w-4 text-primary" />
            <p className="font-semibold text-foreground text-sm">Findings</p>
          </div>
          {analysis.findings.map((finding, index) => (
            <div 
              key={index} 
              className="p-3 rounded-xl bg-card border border-border/50 shadow-soft transition-all hover:shadow-card"
            >
              <div className="flex items-start justify-between mb-1.5">
                <div>
                  <h4 className="font-medium text-foreground text-sm">{finding.type}</h4>
                  <p className="text-xs text-muted-foreground">{finding.location}</p>
                </div>
                <SeverityBadge severity={finding.severity} />
              </div>
              <p className="text-xs text-muted-foreground">{finding.description}</p>
              <p className="text-xs text-muted-foreground/70 mt-1">{(finding.confidence * 100).toFixed(0)}% confidence</p>
            </div>
          ))}
        </div>
      )}

      {/* Specialist & Medications */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-secondary/30">
          <div className="flex items-center gap-1.5 mb-2">
            <UserCheck className="h-3.5 w-3.5 text-primary" />
            <p className="font-medium text-foreground text-xs">Specialist</p>
          </div>
          <p className="text-sm font-semibold text-foreground">{analysis.recommendations.specialistReferral.type}</p>
          <span className={cn(
            "inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium",
            analysis.recommendations.specialistReferral.urgency === 'Emergency' && 'bg-destructive text-destructive-foreground',
            analysis.recommendations.specialistReferral.urgency === 'Urgent' && 'bg-severity-severe text-primary-foreground',
            analysis.recommendations.specialistReferral.urgency === 'Routine' && 'bg-muted text-muted-foreground',
          )}>
            {analysis.recommendations.specialistReferral.urgency}
          </span>
        </div>
        
        <div className="p-3 rounded-xl bg-secondary/30">
          <div className="flex items-center gap-1.5 mb-2">
            <Pill className="h-3.5 w-3.5 text-primary" />
            <p className="font-medium text-foreground text-xs">Medications</p>
          </div>
          <div className="space-y-1">
            {analysis.recommendations.suggestedMedications.slice(0, 2).map((med, index) => (
              <p key={index} className="text-xs text-foreground truncate">{med.name}</p>
            ))}
            {analysis.recommendations.suggestedMedications.length > 2 && (
              <p className="text-xs text-muted-foreground">+{analysis.recommendations.suggestedMedications.length - 2} more</p>
            )}
          </div>
        </div>
      </div>

      {/* Immediate Action */}
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Stethoscope className="h-4 w-4 text-primary" />
          <p className="font-semibold text-foreground text-sm">Next Steps</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{analysis.recommendations.immediateAction}</p>
        {analysis.recommendations.additionalTests.length > 0 && (
          <>
            <Separator className="my-3" />
            <p className="text-xs font-medium text-muted-foreground mb-2">Additional Tests:</p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.recommendations.additionalTests.map((test, index) => (
                <span key={index} className="text-xs px-2 py-1 rounded-full bg-card border border-border/50">
                  {test}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Disclaimer */}
      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-500 leading-relaxed">{analysis.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
