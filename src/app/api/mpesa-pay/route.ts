process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { NextResponse } from 'next/server';
// @ts-ignore
import { Client } from '@paymentsds/mpesa';


export async function POST(request: Request) {
  try {
    const { phone, amount, order_id } = await request.json();

    if (!phone || !amount || !order_id) {
      return NextResponse.json({ error: 'Missing required parameters: phone, amount, or order_id' }, { status: 400 });
    }

    // Format phone to 258xxxxxxxx format if not already done
    let formattedPhone = phone.trim().replace(/\D/g, '');
    if (!formattedPhone.startsWith('258') && formattedPhone.length === 9) {
      formattedPhone = '258' + formattedPhone;
    }

    // Read M-Pesa credentials from environment variables
    const apiKey = process.env.Mpesa_api_key || '';
    const publicKey = process.env.Mpesa_Public_Key || '';

    if (!apiKey || !publicKey) {
      return NextResponse.json({ error: 'M-Pesa credentials not configured.' }, { status: 500 });
    }

    // Initialize PaymentsDS client with environment credentials
    const client = new Client({
      apiKey: apiKey,
      publicKey: publicKey,
      serviceProviderCode: '171717',
      host: 'api.sandbox.vm.co.mz',
      origin: 'zimpeto-wholesale.vercel.app',
      verifySSL: false
    });

    // Clean reference and transaction values of any hyphens or special chars to satisfy PATTERNS.WORD (\w+) SDK check
    const cleanReference = order_id.replace(/[^a-zA-Z0-9_]/g, '');
    const cleanTransaction = ('T' + Math.floor(10000000 + Math.random() * 90000000).toString()).replace(/[^a-zA-Z0-9_]/g, '');

    const paymentData = {
      from: formattedPhone,
      reference: cleanReference,
      transaction: cleanTransaction,
      amount: amount.toString()
    };

    console.log('Calling PaymentsDS client.receive() with:', paymentData);
    const response = await client.receive(paymentData);
    console.log('PaymentsDS response raw:', response);

    const responseData = response.response || response;
    const responseCode = responseData.code;

    if (responseCode === 'INS-0') {
      return NextResponse.json({
        success: true,
        transactionId: response.transaction || responseData.output_TransactionID || response.conversation || 'TX' + Math.floor(10000000 + Math.random() * 90000000),
        data: responseData
      });
    } else {
      return NextResponse.json({
        success: false,
        error: responseData.desc || responseData.output_ResponseDesc || 'Transação M-Pesa falhou.',
        data: responseData
      }, { status: 400 });
    }
  } catch (err: any) {
    console.error('Error in /api/mpesa-pay:', err);
    
    let errorMessage = 'Erro de processamento no M-Pesa';
    let detailData = null;
    
    if (err) {
      if (err.response) {
        detailData = err.response;
        // Check for SDK-wrapped error structure
        if (err.response.outputError) {
          errorMessage = err.response.outputError;
        } 
        // Check for raw Axios response structure
        else if (err.response.data) {
          detailData = err.response.data;
          errorMessage = err.response.data.output_error || 
                         err.response.data.output_ResponseDesc || 
                         err.response.data.desc || 
                         errorMessage;
        } else if (err.response.statusText) {
          errorMessage = err.response.statusText;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      data: detailData
    }, { status: 500 });
  }
}
