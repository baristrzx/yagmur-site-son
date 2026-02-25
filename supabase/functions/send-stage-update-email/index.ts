import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailPayload {
  clientEmail: string;
  clientName: string;
  caseNumber: string;
  currentStage: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();
    const { clientEmail, clientName, caseNumber, currentStage } = payload;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailBody = {
      from: "ANKH Legal <noreply@ankhlegal.com>",
      to: [clientEmail],
      subject: `Dava Güncelleme Bildirimi - Dava No: ${caseNumber}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #f8f8f8; padding: 0;">
          <div style="background: #002147; padding: 32px 40px; text-align: center;">
            <h1 style="color: #e6c34b; font-size: 24px; margin: 0; letter-spacing: 2px;">ANKH LEGAL</h1>
            <p style="color: #ffffff80; font-size: 12px; margin: 8px 0 0; letter-spacing: 1px;">HUKUK & DANIŞMANLIK</p>
          </div>
          <div style="background: #ffffff; padding: 40px;">
            <p style="color: #002147; font-size: 16px; margin: 0 0 16px;">Sayın ${clientName},</p>
            <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
              <strong>${caseNumber}</strong> numaralı davanızda yeni bir güncelleme bulunmaktadır.
            </p>
            <div style="background: #f0f4f8; border-left: 4px solid #e6c34b; padding: 16px 20px; margin: 24px 0; border-radius: 4px;">
              <p style="margin: 0; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Yeni Aşama</p>
              <p style="margin: 8px 0 0; color: #002147; font-size: 18px; font-weight: bold;">${currentStage}</p>
            </div>
            <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">
              Dava detaylarınızı görüntülemek için müvekkil portalınıza giriş yapabilirsiniz.
            </p>
            <div style="text-align: center;">
              <a href="${Deno.env.get("SITE_URL") || "https://ankhlegal.com"}"
                 style="background: #002147; color: #e6c34b; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-size: 14px; letter-spacing: 1px; display: inline-block;">
                PORTALA GİRİŞ YAP
              </a>
            </div>
          </div>
          <div style="background: #f0f4f8; padding: 20px 40px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} ANKH Legal. Tüm hakları saklıdır.</p>
          </div>
        </div>
      `,
    };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailBody),
    });

    const result = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: result }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
