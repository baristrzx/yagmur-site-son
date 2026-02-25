import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ResetPasswordPayload {
  target_user_id: string;
  new_password: string;
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

    const payload: ResetPasswordPayload = await req.json();
    const { target_user_id, new_password } = payload;

    if (!target_user_id || !new_password) {
      return new Response(
        JSON.stringify({ error: "Zorunlu alanlar eksik: target_user_id, new_password" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (new_password.length < 8) {
      return new Response(
        JSON.stringify({ error: "Şifre en az 8 karakter olmalıdır" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: targetProfile } = await adminClient
      .from("profiles")
      .select("email, full_name, role")
      .eq("id", target_user_id)
      .maybeSingle();

    if (!targetProfile) {
      return new Response(
        JSON.stringify({ error: "Kullanıcı bulunamadı" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: updateError } = await adminClient.auth.admin.updateUserById(
      target_user_id,
      { password: new_password }
    );

    if (updateError) {
      return new Response(
        JSON.stringify({ error: "Şifre güncellenemedi", details: updateError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SITE_URL = Deno.env.get("SITE_URL") || "https://ankhlegal.com";

    if (RESEND_API_KEY && targetProfile.email) {
      const emailBody = {
        from: "ANKH Legal <noreply@ankhlegal.com>",
        to: [targetProfile.email],
        subject: "Şifreniz Güncellendi — ANKH Legal",
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #f8f8f8; padding: 0;">
            <div style="background: #002147; padding: 32px 40px; text-align: center;">
              <h1 style="color: #e6c34b; font-size: 24px; margin: 0; letter-spacing: 2px;">ANKH LEGAL</h1>
              <p style="color: #ffffff80; font-size: 12px; margin: 8px 0 0; letter-spacing: 1px;">ŞİFRE GÜNCELLEME BİLDİRİMİ</p>
            </div>
            <div style="background: #ffffff; padding: 40px;">
              <p style="color: #002147; font-size: 16px; margin: 0 0 16px;">Sayın ${targetProfile.full_name},</p>
              <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                Hesabınızın şifresi yönetici tarafından güncellenmiştir.
              </p>
              <div style="background: #fff8e6; border-left: 4px solid #e6c34b; padding: 16px 20px; margin: 24px 0; border-radius: 4px;">
                <p style="margin: 0; color: #a88c22; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                  Güvenlik Uyarısı
                </p>
                <p style="margin: 8px 0 0; color: #333; font-size: 14px; line-height: 1.5;">
                  Bu işlemi siz yapmadıysanız lütfen derhal yöneticinizle iletişime geçin.
                </p>
              </div>
              <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">
                Yeni şifrenizle portala giriş yapabilirsiniz.
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
                Bu e-posta otomatik olarak gönderilmiştir.<br/>
                © ${new Date().getFullYear()} ANKH Legal. Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        `,
      };

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailBody),
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Şifre başarıyla güncellendi" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
