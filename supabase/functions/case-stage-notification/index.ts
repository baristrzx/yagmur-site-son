import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface StageNotificationPayload {
  caseId: string;
  newStage: string;
  executionStatus?: string;
  hearingDate?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Yetkisiz erişim" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await callerClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Yetkisiz erişim" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: callerProfile } = await callerClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!callerProfile || callerProfile.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Yasak: yalnızca admin erişebilir" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload: StageNotificationPayload = await req.json();
    const { caseId, newStage, executionStatus, hearingDate } = payload;

    if (!caseId || !newStage) {
      return new Response(
        JSON.stringify({ error: "Zorunlu alanlar eksik: caseId, newStage" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: caseData, error: caseError } = await adminClient
      .from("cases")
      .select("case_number, title, client_id, profiles(full_name, email)")
      .eq("id", caseId)
      .maybeSingle();

    if (caseError || !caseData) {
      return new Response(
        JSON.stringify({ error: "Dava bulunamadı" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: updateError } = await adminClient
      .from("cases")
      .update({
        current_stage: newStage,
        ...(executionStatus !== undefined && { execution_status: executionStatus }),
        ...(hearingDate !== undefined && { hearing_date: hearingDate }),
      })
      .eq("id", caseId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: "Dava güncellenemedi", details: updateError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const clientProfile = caseData.profiles as { full_name: string; email: string } | null;

    if (!clientProfile?.email) {
      return new Response(
        JSON.stringify({ success: true, warning: "Dava güncellendi ancak müvekkil email adresi bulunamadı" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SITE_URL = Deno.env.get("SITE_URL") || "https://ankhlegal.com";

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ success: true, warning: "Dava güncellendi ancak email gönderilemedi: RESEND_API_KEY yapılandırılmamış" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const formattedHearingDate = hearingDate
      ? new Date(hearingDate).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })
      : null;

    const emailBody = {
      from: "ANKH Legal <noreply@ankhlegal.com>",
      to: [clientProfile.email],
      subject: `Dava Güncelleme Bildirimi — ${caseData.case_number}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #f8f8f8; padding: 0;">
          <div style="background: #002147; padding: 32px 40px; text-align: center;">
            <h1 style="color: #e6c34b; font-size: 24px; margin: 0; letter-spacing: 2px;">ANKH LEGAL</h1>
            <p style="color: #ffffff80; font-size: 12px; margin: 8px 0 0; letter-spacing: 1px;">DAVA GÜNCELLEME BİLDİRİMİ</p>
          </div>
          <div style="background: #ffffff; padding: 40px;">
            <p style="color: #002147; font-size: 16px; margin: 0 0 16px;">Sayın ${clientProfile.full_name},</p>
            <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
              <strong>${caseData.case_number}</strong> numaralı davanızda güncelleme gerçekleşmiştir.
            </p>
            <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 12px 0; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; width: 160px;">Dava No</td>
                <td style="padding: 12px 0; color: #002147; font-size: 15px; font-weight: bold;">${caseData.case_number}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 12px 0; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Dava Başlığı</td>
                <td style="padding: 12px 0; color: #002147; font-size: 15px;">${caseData.title}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 12px 0; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Yeni Aşama</td>
                <td style="padding: 12px 0;">
                  <span style="background: #e6c34b20; color: #a88c22; font-size: 14px; font-weight: bold; padding: 4px 12px; border-radius: 20px; border: 1px solid #e6c34b40;">
                    ${newStage}
                  </span>
                </td>
              </tr>
              ${executionStatus ? `
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 12px 0; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">İcra Durumu</td>
                <td style="padding: 12px 0; color: #002147; font-size: 15px;">${executionStatus}</td>
              </tr>` : ""}
              ${formattedHearingDate ? `
              <tr>
                <td style="padding: 12px 0; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Duruşma Tarihi</td>
                <td style="padding: 12px 0; color: #002147; font-size: 15px; font-weight: bold;">${formattedHearingDate}</td>
              </tr>` : ""}
            </table>
            <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">
              Dava detaylarınızı ve belgelerinizi görüntülemek için müvekkil portalınıza giriş yapabilirsiniz.
            </p>
            <div style="text-align: center;">
              <a href="${SITE_URL}/portal"
                 style="background: #002147; color: #e6c34b; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-size: 14px; letter-spacing: 1px; display: inline-block; font-weight: bold;">
                PORTALA GİRİŞ YAP
              </a>
            </div>
          </div>
          <div style="background: #f0f4f8; padding: 20px 40px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Bu e-posta otomatik olarak gönderilmiştir. Yanıtlamayınız.<br/>
              © ${new Date().getFullYear()} ANKH Legal. Tüm hakları saklıdır.
            </p>
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
        JSON.stringify({ success: true, warning: "Dava güncellendi ancak email gönderilemedi", details: resendResult }),
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
