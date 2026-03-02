import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SITE_URL = "https://ankhlegal.com";

const STATIC_PAGES = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/#stratejik-yaklasim", priority: "0.8", changefreq: "monthly" },
  { loc: "/#expertise", priority: "0.8", changefreq: "monthly" },
  { loc: "/#arabuluculuk", priority: "0.7", changefreq: "monthly" },
  { loc: "/#knowledge", priority: "0.8", changefreq: "weekly" },
  { loc: "/#founder", priority: "0.7", changefreq: "monthly" },
  { loc: "/#contact", priority: "0.7", changefreq: "monthly" },
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    const { data: legalPages } = await supabase
      .from("legal_pages")
      .select("slug, updated_at")
      .eq("is_published", true);

    const now = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    for (const page of STATIC_PAGES) {
      xml += `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    if (posts && posts.length > 0) {
      for (const post of posts) {
        const lastmod = post.updated_at
          ? post.updated_at.split("T")[0]
          : post.published_at
          ? post.published_at.split("T")[0]
          : now;

        xml += `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
      }
    }

    if (legalPages && legalPages.length > 0) {
      for (const page of legalPages) {
        const lastmod = page.updated_at ? page.updated_at.split("T")[0] : now;
        xml += `  <url>
    <loc>${SITE_URL}/${page.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
`;
      }
    }

    xml += `</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
