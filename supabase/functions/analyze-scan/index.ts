import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, scanType } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'No image provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an advanced medical imaging AI assistant specialized in bone fracture detection and musculoskeletal abnormality analysis. You analyze medical scans (X-rays, CT scans, MRI) to detect bone fractures, abnormalities, and other conditions.

IMPORTANT DISCLAIMER: This is an AI-assisted analysis tool for educational and screening purposes only. All findings must be verified by a qualified medical professional.

When analyzing an image, you must provide a structured analysis in the following JSON format:

{
  "scanAnalysis": {
    "scanType": "X-ray/CT/MRI",
    "bodyRegion": "specific anatomical region",
    "imageQuality": "Good/Fair/Poor"
  },
  "findings": [
    {
      "type": "Fracture/Abnormality type",
      "location": "Specific bone and location",
      "description": "Detailed description of the finding",
      "severity": "Mild/Moderate/Severe/Critical",
      "confidence": 0.95
    }
  ],
  "overallSeverity": "Normal/Mild/Moderate/Severe/Critical",
  "severityScore": 0-100,
  "recommendations": {
    "immediateAction": "What needs to be done immediately",
    "specialistReferral": {
      "type": "Orthopedic Surgeon/Oncologist/Rheumatologist/Neurologist/etc.",
      "urgency": "Routine/Urgent/Emergency",
      "reason": "Why this specialist is recommended"
    },
    "suggestedMedications": [
      {
        "name": "Medication name",
        "purpose": "Pain relief/Anti-inflammatory/etc.",
        "note": "Must be prescribed by physician"
      }
    ],
    "additionalTests": ["Any additional imaging or tests recommended"]
  },
  "summary": "A comprehensive but concise summary of findings in 2-3 sentences",
  "disclaimer": "This AI analysis is for screening purposes only. Please consult a qualified healthcare professional for diagnosis and treatment."
}

Analyze the medical scan image provided and return ONLY the JSON response with your analysis. Be thorough but accurate. If you cannot detect any abnormalities, indicate normal findings. Always err on the side of caution for patient safety.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Please analyze this ${scanType || 'medical'} scan for bone fractures, abnormalities, and any other concerning findings. Provide a comprehensive analysis with severity assessment, specialist recommendations, and suggested medications.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 4096,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI model');
    }

    // Parse the JSON response from the AI
    let analysisResult;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                        aiResponse.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : aiResponse;
      analysisResult = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Return raw response if parsing fails
      analysisResult = {
        rawResponse: aiResponse,
        parseError: true
      };
    }

    console.log('Scan analysis completed successfully');

    return new Response(
      JSON.stringify({ analysis: analysisResult }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-scan function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
