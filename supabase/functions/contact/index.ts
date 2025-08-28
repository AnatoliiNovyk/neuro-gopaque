import { createClient } from 'npm:@supabase/supabase-js@2';

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { name, email, subject, message }: ContactRequest = await req.json();

    // Validate input
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Всі поля обов\'язкові' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Log the contact form submission (in production, you might want to store it in a table or send an email)
    console.log('Contact form submission:', { name, email, subject, message });

    // For demo purposes, we'll just log it and return success
    // In production, you would:
    // 1. Store the message in a database table
    // 2. Send an email notification
    // 3. Integrate with a CRM system

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Повідомлення успішно надіслано!' 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Помилка при обробці повідомлення' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});