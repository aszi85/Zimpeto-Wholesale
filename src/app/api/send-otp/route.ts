import { NextResponse } from 'next/server';
// @ts-ignore
import { supabase } from '../../../../supabase.js';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 1. Generate 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Set 10-minute expiry time
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 3. Save OTP record to Supabase
    if (!supabase) {
      return NextResponse.json({ error: 'Database client not configured' }, { status: 500 });
    }

    const { error: insertError } = await supabase
      .from('otps')
      .insert({
        email,
        code,
        expires_at: expiresAt,
        used: false
      });

    if (insertError) {
      console.error('Error inserting OTP into Supabase:', insertError);
      return NextResponse.json({ error: 'Failed to save OTP' }, { status: 500 });
    }

    // 4. Send email using Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.log(`[TESTING MODE] Generated OTP for ${email}: ${code}`);
      return NextResponse.json({
        success: true,
        message: 'OTP generated in Testing Mode (Logged to console)',
        testMode: true,
        code: code // We send it back for testing convenience if key is not configured
      });
    }

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [email],
        subject: 'Código de Verificação OTP - Zimpeto Wholesale',
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #004d40; text-transform: uppercase; font-style: italic;">Zimpeto Wholesale</h2>
            <p>Olá,</p>
            <p>Recebemos uma solicitação de contacto. Use o código de verificação abaixo para confirmar o seu endereço de email e concluir o envio:</p>
            <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #ff9800; margin: 20px 0;">
              ${code}
            </div>
            <p>Este código expira em <strong>10 minutos</strong>. Se você não fez essa solicitação, pode ignorar este email com segurança.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="font-size: 11px; color: #a0aec0;">Zimpeto Wholesale • Mercado do Zimpeto, Maputo</p>
          </div>
        `
      })
    });

    if (!resendRes.ok) {
      const errorText = await resendRes.text();
      console.error('Resend API error:', errorText);
      return NextResponse.json({ error: 'Failed to send email via Resend API' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (err: any) {
    console.error('POST Route Handler Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
