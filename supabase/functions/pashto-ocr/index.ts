import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    if (!image) {
      throw new Error('No image provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Processing Pashto OCR request...');

    // Use Gemini's vision capabilities for OCR
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert Pashto OCR system specialized in reading handwritten Pashto text. Your task is to:

1. Carefully analyze the handwritten Pashto text in the image
2. Transcribe the text EXACTLY as written, preserving all characters
3. Return ONLY the transcribed Pashto text, nothing else
4. If you cannot read certain characters clearly, make your best educated guess based on context
5. If the image doesn't contain Pashto text or is unclear, respond with "UNREADABLE"

Important:
- Pashto uses a modified Arabic script with additional letters
- Pay attention to dots (nuqta) above and below letters
- Common Pashto-specific letters: ټ, ډ, ړ, ږ, ښ, ګ, ڼ, ۍ, ئ
- Preserve the exact spelling and word boundaries
- Do not add any explanations or commentary`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please read and transcribe the handwritten Pashto text in this image. Return only the transcribed text.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.1, // Low temperature for more accurate OCR
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const recognizedText = data.choices?.[0]?.message?.content?.trim() || '';

    console.log('OCR result:', recognizedText);

    // Check if the text was unreadable
    if (recognizedText === 'UNREADABLE' || !recognizedText) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          text: '',
          message: 'Could not read the text in the image. Please ensure the handwriting is clear and try again.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        text: recognizedText,
        message: 'Text recognized successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Pashto OCR error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        text: ''
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
