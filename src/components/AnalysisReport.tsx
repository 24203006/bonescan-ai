import { FileText, AlertTriangle, Pill, UserCheck, Stethoscope, Activity, Bone, Download, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const handlePrint = () => {
    window.print();
  };

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
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 7;
      addWrappedText(title, 12, true);
      y += 2;
    };

    // Header
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('OsteoVision AI', margin, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Bone Fracture Analysis Report', margin, 26);
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

    doc.save(`bone-analysis-report-${Date.now()}.pdf`);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl gradient-primary shadow-soft hover-glow transition-all duration-300">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Analysis Report</h2>
            <p className="text-sm text-muted-foreground">AI-Generated Medical Analysis</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="hover-scale">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="hover-scale">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Overall Severity Card */}
      <Card className="glass shadow-card border-2 overflow-hidden animate-fade-in-up delay-100 hover-lift">
        <div className={cn(
          "h-2 w-full",
          analysis.overallSeverity.toLowerCase() === 'normal' && 'severity-normal',
          analysis.overallSeverity.toLowerCase() === 'mild' && 'severity-mild',
          analysis.overallSeverity.toLowerCase() === 'moderate' && 'severity-moderate',
          analysis.overallSeverity.toLowerCase() === 'severe' && 'severity-severe',
          analysis.overallSeverity.toLowerCase() === 'critical' && 'severity-critical',
        )} />
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overall Assessment</p>
              <SeverityIndicator 
                severity={analysis.overallSeverity} 
                score={analysis.severityScore} 
                size="lg" 
              />
            </div>
            <div className="text-right glass-subtle px-4 py-3 rounded-xl">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Scan Type</p>
              <p className="font-semibold text-foreground">{analysis.scanAnalysis.scanType}</p>
              <p className="text-sm text-muted-foreground">{analysis.scanAnalysis.bodyRegion}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="glass shadow-card animate-fade-in-up delay-200 hover-lift">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{analysis.summary}</p>
        </CardContent>
      </Card>

      {/* Findings */}
      {analysis.findings.length > 0 && (
        <Card className="glass shadow-card animate-fade-in-up delay-300 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Bone className="h-4 w-4 text-primary" />
              </div>
              Detailed Findings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.findings.map((finding, index) => (
              <div 
                key={index} 
                className="p-4 rounded-xl glass-subtle border transition-all duration-300 hover:shadow-soft"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{finding.type}</h4>
                    <p className="text-sm text-muted-foreground">{finding.location}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <SeverityBadge severity={finding.severity} />
                    <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted">
                      {(finding.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                </div>
                <p className="text-sm text-foreground">{finding.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Specialist Referral */}
        <Card className="glass shadow-card animate-fade-in-up delay-400 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <UserCheck className="h-4 w-4 text-primary" />
              </div>
              Specialist Referral
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
              <div>
                <p className="font-semibold text-foreground">
                  {analysis.recommendations.specialistReferral.type}
                </p>
                <p className="text-xs text-muted-foreground">Recommended Specialist</p>
              </div>
              <span className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                analysis.recommendations.specialistReferral.urgency === 'Emergency' && 'bg-destructive text-destructive-foreground animate-pulse',
                analysis.recommendations.specialistReferral.urgency === 'Urgent' && 'severity-severe text-primary-foreground',
                analysis.recommendations.specialistReferral.urgency === 'Routine' && 'bg-muted text-muted-foreground',
              )}>
                {analysis.recommendations.specialistReferral.urgency}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysis.recommendations.specialistReferral.reason}
            </p>
          </CardContent>
        </Card>

        {/* Medications */}
        <Card className="glass shadow-card animate-fade-in-up delay-500 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Pill className="h-4 w-4 text-primary" />
              </div>
              Suggested Medications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analysis.recommendations.suggestedMedications.map((med, index) => (
              <div 
                key={index} 
                className="p-3 rounded-xl glass-subtle border transition-all duration-300 hover:shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{med.name}</p>
                  <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted">{med.purpose}</span>
                </div>
                <p className="text-xs text-muted-foreground italic mt-1">{med.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Immediate Action */}
      <Card className="glass shadow-card border-primary/20 bg-primary/5 animate-slide-up hover-lift">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 rounded-lg bg-primary/20">
              <Stethoscope className="h-4 w-4 text-primary" />
            </div>
            Immediate Action Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{analysis.recommendations.immediateAction}</p>
          {analysis.recommendations.additionalTests.length > 0 && (
            <>
              <Separator className="my-4" />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Additional Tests Recommended:</p>
                <ul className="space-y-2">
                  {analysis.recommendations.additionalTests.map((test, index) => (
                    <li 
                      key={index} 
                      className="text-sm text-foreground flex items-center gap-2 p-2 rounded-lg glass-subtle"
                    >
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      {test}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="glass shadow-soft border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800 animate-fade-in-up">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
            </div>
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-400 mb-1">Important Disclaimer</p>
              <p className="text-sm text-amber-700 dark:text-amber-500 leading-relaxed">{analysis.disclaimer}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
