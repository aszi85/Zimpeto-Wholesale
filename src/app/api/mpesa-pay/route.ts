process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { NextResponse } from 'next/server';
// @ts-ignore
import { Client, Service } from '@paymentsds/mpesa';

// Override Service.prototype.buildResponse to support custom error properties and prevent crashes on connection failure
if (Service && Service.prototype) {
  Service.prototype.buildResponse = function(result: any) {
    if (result.status >= 200 && result.status < 300) {
      return {
        response: {
          status: result.status,
          code: result.data.output_ResponseCode,
          desc: result.data.output_ResponseDesc
        },
        conversation: result.data.output_ConversationID,
        transaction: result.data.output_TransactionID,
        reference: result.data.output_ThirdPartyReference
      };
    }

    const responseData = result.response ? result.response.data : null;
    return {
      response: {
        status: result.response ? result.response.status : 500,
        statusText: result.response ? result.response.statusText : (result.message || 'Error'),
        outputError: responseData ? (responseData.output_error || responseData.output_ResponseDesc || responseData.output_ResponseCode) : null,
        data: responseData
      }
    };
  };
}


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

    // Initialize PaymentsDS client with the exact credentials provided
    const client = new Client({
      apiKey: 'sm1s6d5q93uklcz94rf5sxhp0satgbq7',
      publicKey: 'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAmptSWqV7cGUUJJhUBxsMLonux24u+FoTlrb+4Kgc6092JIszmI1QUoMohaDDXSVueXx6IXwYGsjjWY32HGXj1iQhkALXfObJ4DqXn5h6E8y5/xQYNAyd5bpN5Z8r892B6toGzZQVB7qtebH4apDjmvTi5FGZVjVYxalyyQkj4uQbbRQjgCkubSi45Xl4CGtLqZztsKssWz3mcKncgTnq3DHGYYEYiKq0xIj100LGbnvNz20Sgqmw/cH+Bua4GJsWYLEqf/h/yiMgiBbxFxsnwZl0im5vXDlwKPw+QnO2fscDhxZFAwV06bgG0oEoWm9FnjMsfvwm0rUNYFlZ+TOtCEhmhtFp+Tsx9jPCuOd5h2emGdSKD8A6jtwhNa7oQ8RtLEEqwAn44orENa1ibOkxMiiiFpmmJkwgZPOG/zMCjXIrrhDWTDUOZaPx/lEQoInJoE2i43VN/HTGCCw8dKQAwg0jsEXau5ixD0GUothqvuX3B9taoeoFAIvUPEq35YulprMM7ThdKodSHvhnwKG82dCsodRwY428kg2xM/UjiTENog4B6zzZfPhMxFlOSFX4MnrqkAS+8Jamhy1GgoHkEMrsT5+/ofjCx0HjKbT5NuA2V/lmzgJLl3jIERadLzuTYnKGWxVJcGLkWXlEPYLbiaKzbJb2sYxt+Kt5OxQqC1MCAwEAAQ==',
      serviceProviderCode: '171717',
      host: 'api.sandbox.vm.co.mz',
      origin: 'developer.mpesa.vm.co.mz',
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
