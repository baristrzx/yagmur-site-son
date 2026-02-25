import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactPayload {
  full_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload: ContactPayload = await req.json();
    const { full_name, email, phone, subject, message } = payload;

    if (!full_name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Zorunlu alanlar eksik: full_name, email, subject, message" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { error: dbError } = await adminClient.from("contact_messages").insert({
      full_name,
      email,
      phone: phone || "",
      subject,
      message,
      is_read: false,
    });

    if (dbError) {
      return new Response(
        JSON.stringify({ error: "Mesaj kaydedilemedi", details: dbError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "admin@ankhlegal.com";

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ success: true, warning: "Mesaj kaydedildi ancak email gönderilemedi: RESEND_API_KEY yapılandırılmamış" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailBody = {
      from: "ANKH Legal <noreply@ankhlegal.com>",
      to: [ADMIN_EMAIL],
      reply_to: email,
      subject: `Yeni İletişim Mesajı: ${subject}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #f8f8f8; padding: 0;">
          <div style="background: #002147; padding: 32px 40px; text-align: center;">
            <h1 style="color: #e6c34b; font-size: 24px; margin: 0; letter-spacing: 2px;">ANKH LEGAL</h1>
            <p style="color: #ffffff80; font-size: 12px; margin: 8px 0 0; letter-spacing: 1px;">YENİ İLETİŞİM MESAJI</p>
          </div>
          <div style="background: #ffffff; padding: 40px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 12px 0; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; width: 140px;">Ad Soyad</td>
                <td style="padding: 12px 0; color: #002147; font-size: 15px; font-weight: bold;">${full_name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 12px 0; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">E-posta</td>
                <td style="padding: 12px 0; color: #002147; font-size: 15px;">
                  <a href="mailto:${email}" style="color: #0062ff; text-decoration: none;">${email}</a>
                </td>
              </tr>
              ${phone ? `
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 12px 0; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Telefon</td>
                <td style="padding: 12px 0; color: #002147; font-size: 15px;">${phone}</td>
              </tr>` : ""}
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 12px 0; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Konu</td>
                <td style="padding: 12px 0; color: #002147; font-size: 15px; font-weight: bold;">${subject}</td>
              </tr>
            </table>
            <div style="background: #f0f4f8; border-left: 4px solid #e6c34b; padding: 20px 24px; border-radius: 4px;">
              <p style="margin: 0 0 8px; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Mesaj</p>
              <p style="margin: 0; color: #002147; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="color: #999; font-size: 12px; margin: 24px 0 0; line-height: 1.5;">
              Bu mesajı yanıtlamak için doğrudan bu e-postaya yanıt verebilirsiniz.
              Mesaj, veritabanına da kaydedilmiştir.
            </p>
          </div>
          <div style="background: #f0f4f8; padding: 20px 40px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} ANKH Legal. Tüm hakları saklıdır.</p>
          </div>
        </div>
      `,
    };

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailBody),
    });

    const resendResult = await resendResponse.json();

    if (!resendResponse.ok) {
      return new Response(
        JSON.stringify({ success: true, warning: "Mesaj kaydedildi ancak email gönderilemedi", details: resendResult }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, email_id: resendResult.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
