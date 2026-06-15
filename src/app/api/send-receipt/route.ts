import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, customer_name, phone, address, items, total_price, order_id } = await request.json();

    if (!email || !customer_name || !items || !total_price || !order_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY is not configured. Logging order notification.');
      return NextResponse.json({
        success: true,
        message: 'Order received. (Simulated email: key not set)'
      });
    }

    // Generate table rows for items
    const itemRows = items.map((item: any) => `
      <tr style="border-bottom: 1px solid #edf2f7;">
        <td style="padding: 12px 0; font-size: 14px; color: #2d3748;">
          <strong>${item.name}</strong>
        </td>
        <td style="padding: 12px 0; text-align: center; font-size: 14px; color: #4a5568;">
          x${item.qtd}
        </td>
        <td style="padding: 12px 0; text-align: right; font-size: 14px; color: #2d3748; font-weight: bold;">
          ${(item.price * item.qtd).toLocaleString('pt-MZ')} MT
        </td>
      </tr>
    `).join('');

    const htmlContent = `
      <div style="font-family: 'Outfit', sans-serif, Arial; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <!-- Header -->
        <div style="text-align: center; padding-bottom: 25px; border-b: 2px solid #edf2f7; border-bottom: 2px solid #edf2f7; margin-bottom: 25px;">
          <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #ff9800; margin-bottom: 5px;">Zimpeto Wholesale</div>
          <h2 style="color: #004d40; text-transform: uppercase; font-style: italic; font-weight: 900; margin: 0; font-size: 24px; tracking: -0.05em;">Recibo de Encomenda</h2>
          <p style="color: #718096; font-size: 12px; margin-top: 5px; font-family: monospace;">ID: ${order_id}</p>
        </div>

        <!-- Greeting -->
        <p style="font-size: 15px; color: #2d3748; line-height: 1.6;">Olá <strong>${customer_name}</strong>,</p>
        <p style="font-size: 15px; color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
          Agradecemos a sua preferência! Recebemos os detalhes do seu pedido e estamos processando o envio. Abaixo estão os detalhes da sua fatura:
        </p>

        <!-- Address & Details Panel -->
        <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin-bottom: 25px;">
          <h4 style="color: #004d40; text-transform: uppercase; font-size: 11px; font-weight: 900; margin: 0 0 10px 0; letter-spacing: 1px;">Destinatário & Envio</h4>
          <table style="width: 100%; font-size: 13px; line-height: 1.6; color: #4a5568;">
            <tr>
              <td style="width: 30%; font-weight: bold; padding: 2px 0;">Cliente:</td>
              <td style="padding: 2px 0; color: #2d3748;">${customer_name}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 2px 0;">Telefone:</td>
              <td style="padding: 2px 0; color: #2d3748;">${phone || '-'}</td>
            </tr>
            <tr>
              <td style="vertical-align: top; font-weight: bold; padding: 2px 0;">Morada:</td>
              <td style="padding: 2px 0; color: #2d3748;">${address}</td>
            </tr>
          </table>
        </div>

        <!-- Items Table -->
        <h4 style="color: #004d40; text-transform: uppercase; font-size: 11px; font-weight: 900; margin: 0 0 10px 0; letter-spacing: 1px;">Resumo dos Artigos</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          <thead>
            <tr style="border-bottom: 2px solid #edf2f7; text-align: left; font-size: 11px; font-weight: bold; text-transform: uppercase; color: #718096;">
              <th style="padding-bottom: 8px;">Artigo</th>
              <th style="padding-bottom: 8px; text-align: center;">Qtd</th>
              <th style="padding-bottom: 8px; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding-top: 15px; font-size: 16px; font-weight: bold; color: #004d40; text-transform: uppercase;">Total</td>
              <td style="padding-top: 15px; text-align: right; font-size: 20px; font-weight: 950; color: #004d40; font-style: italic;">
                ${total_price.toLocaleString('pt-MZ')} MT
              </td>
            </tr>
          </tfoot>
        </table>

        <!-- Note -->
        <div style="border-top: 1px solid #edf2f7; padding-top: 20px; text-align: center;">
          <p style="font-size: 13px; color: #718096; line-height: 1.5; margin: 0;">
            A nossa equipa entrará em contacto em breve para formalizar o pedido e agendar a entrega do material.
          </p>
        </div>

        <!-- Footer -->
        <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 25px 0;">
        <p style="font-size: 10px; color: #a0aec0; text-align: center; margin: 0;">
          Zimpeto Wholesale • Mercado do Zimpeto, Maputo, Moçambique
        </p>
      </div>
    `;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [email],
        subject: `Confirmação de Encomenda - Zimpeto Wholesale #${order_id.substring(0, 8)}`,
        html: htmlContent
      })
    });

    if (!resendRes.ok) {
      const errorText = await resendRes.text();
      console.error('Resend API error:', errorText);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error sending receipt:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
