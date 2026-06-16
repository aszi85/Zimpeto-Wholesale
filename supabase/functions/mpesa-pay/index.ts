import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client } from "npm:@paymentsds/mpesa@0.1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { phone, amount, order_id } = await req.json();

    if (!phone || !amount || !order_id) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: phone, amount, or order_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format phone to 258xxxxxxxx format
    let formattedPhone = phone.trim().replace(/\D/g, '');
    if (!formattedPhone.startsWith("258") && formattedPhone.length === 9) {
      formattedPhone = "258" + formattedPhone;
    }

    // Initialize PaymentsDS client with the exact credentials provided
    const client = new Client({
      apiKey: "CKyWC7LJqyqUpdtMUDx0B9oOi0KOl4cp",
      publicKey: "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==",
      serviceProviderCode: "171717",
      host: "api.sandbox.vm.co.mz",
      origin: "zimpeto-wholesale.vercel.app",
      verifySSL: false,
    });

    const cleanReference = order_id.replace(/[^a-zA-Z0-9_]/g, "");
    const cleanTransaction = ("T" + Math.floor(10000000 + Math.random() * 90000000).toString()).replace(/[^a-zA-Z0-9_]/g, "");

    const paymentData = {
      from: formattedPhone,
      reference: cleanReference,
      transaction: cleanTransaction,
      amount: amount.toString(),
    };

    console.log("Calling PaymentsDS client.receive() in Edge Function with:", paymentData);
    const response = await client.receive(paymentData);
    console.log("PaymentsDS response raw in Edge Function:", response);

    const responseData = response.response || response;
    const responseCode = responseData.code;

    if (responseCode === "INS-0") {
      return new Response(
        JSON.stringify({
          success: true,
          transactionId: response.transaction || responseData.output_TransactionID || response.conversation || "TX" + Math.floor(10000000 + Math.random() * 90000000),
          data: responseData,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: responseData.desc || responseData.output_ResponseDesc || "Transação M-Pesa falhou.",
          data: responseData,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (err: any) {
    console.error("Error in Edge Function mpesa-pay:", err);
    
    let errorMessage = "Erro de processamento no M-Pesa";
    if (err) {
      if (err.response) {
        if (err.response.outputError) {
          errorMessage = err.response.outputError;
        } else if (err.response.data) {
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

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
