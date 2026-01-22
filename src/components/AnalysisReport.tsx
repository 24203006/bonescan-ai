import { FileText, AlertTriangle, Pill, UserCheck, Stethoscope, Activity, Bone, Download, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SeverityIndicator, SeverityBadge } from './SeverityIndicator';
import { cn } from '@/lib/utils';

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

  const handleDownload = () => {
    const reportText = `
BONE FRACTURE ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}

SCAN INFORMATION
================
Type: ${analysis.scanAnalysis.scanType}
Body Region: ${analysis.scanAnalysis.bodyRegion}
Image Quality: ${analysis.scanAnalysis.imageQuality}

OVERALL ASSESSMENT
==================
Severity: ${analysis.overallSeverity} (Score: ${analysis.severityScore}/100)

SUMMARY
=======
${analysis.summary}

FINDINGS
========
${analysis.findings.map((f, i) => `
${i + 1}. ${f.type}
   Location: ${f.location}
   Description: ${f.description}
   Severity: ${f.severity}
   Confidence: ${(f.confidence * 100).toFixed(0)}%
`).join('\n')}

RECOMMENDATIONS
===============
Immediate Action: ${analysis.recommendations.immediateAction}

Specialist Referral:
- Type: ${analysis.recommendations.specialistReferral.type}
- Urgency: ${analysis.recommendations.specialistReferral.urgency}
- Reason: ${analysis.recommendations.specialistReferral.reason}

Suggested Medications:
${analysis.recommendations.suggestedMedications.map(m => `- ${m.name}: ${m.purpose} (${m.note})`).join('\n')}

Additional Tests Recommended:
${analysis.recommendations.additionalTests.map(t => `- ${t}`).join('\n')}

DISCLAIMER
==========
${analysis.disclaimer}
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bone-analysis-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl gradient-primary shadow-soft">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Analysis Report</h2>
            <p className="text-sm text-muted-foreground">AI-Generated Medical Analysis</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Overall Severity Card */}
      <Card className="shadow-card border-2 overflow-hidden">
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
              <p className="text-sm text-muted-foreground">Overall Assessment</p>
              <SeverityIndicator 
                severity={analysis.overallSeverity} 
                score={analysis.severityScore} 
                size="lg" 
              />
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Scan Type</p>
              <p className="font-semibold text-foreground">{analysis.scanAnalysis.scanType}</p>
              <p className="text-sm text-muted-foreground">{analysis.scanAnalysis.bodyRegion}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-primary" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{analysis.summary}</p>
        </CardContent>
      </Card>

      {/* Findings */}
      {analysis.findings.length > 0 && (
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bone className="h-5 w-5 text-primary" />
              Detailed Findings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.findings.map((finding, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{finding.type}</h4>
                    <p className="text-sm text-muted-foreground">{finding.location}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <SeverityBadge severity={finding.severity} />
                    <span className="text-xs text-muted-foreground">
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
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="h-5 w-5 text-primary" />
              Specialist Referral
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <div>
                <p className="font-semibold text-foreground">
                  {analysis.recommendations.specialistReferral.type}
                </p>
                <p className="text-xs text-muted-foreground">Recommended Specialist</p>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold",
                analysis.recommendations.specialistReferral.urgency === 'Emergency' && 'bg-destructive text-destructive-foreground',
                analysis.recommendations.specialistReferral.urgency === 'Urgent' && 'severity-severe text-primary-foreground',
                analysis.recommendations.specialistReferral.urgency === 'Routine' && 'bg-muted text-muted-foreground',
              )}>
                {analysis.recommendations.specialistReferral.urgency}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {analysis.recommendations.specialistReferral.reason}
            </p>
          </CardContent>
        </Card>

        {/* Medications */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Pill className="h-5 w-5 text-primary" />
              Suggested Medications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analysis.recommendations.suggestedMedications.map((med, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{med.name}</p>
                  <span className="text-xs text-muted-foreground">{med.purpose}</span>
                </div>
                <p className="text-xs text-muted-foreground italic mt-1">{med.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Immediate Action */}
      <Card className="shadow-card border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Stethoscope className="h-5 w-5 text-primary" />
            Immediate Action Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">{analysis.recommendations.immediateAction}</p>
          {analysis.recommendations.additionalTests.length > 0 && (
            <>
              <Separator className="my-4" />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Additional Tests Recommended:</p>
                <ul className="space-y-1">
                  {analysis.recommendations.additionalTests.map((test, index) => (
                    <li key={index} className="text-sm text-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
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
      <Card className="shadow-soft border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-400 mb-1">Important Disclaimer</p>
              <p className="text-sm text-amber-700 dark:text-amber-500">{analysis.disclaimer}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
