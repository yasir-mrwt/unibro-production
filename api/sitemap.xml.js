export default function handler(req, res) {
  const baseUrl = "https://unibro-production.vercel.app";
  const today = new Date().toISOString().split("T")[0];

  const urls = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/submit", priority: "0.8", changefreq: "monthly" },
    { loc: "/community", priority: "0.8", changefreq: "monthly" },
    { loc: "/about", priority: "0.7", changefreq: "monthly" },
    { loc: "/resources", priority: "0.9", changefreq: "weekly" },
    { loc: "/select-department", priority: "0.8", changefreq: "monthly" },
    { loc: "/select-semester", priority: "0.8", changefreq: "monthly" },
    { loc: "/staff", priority: "0.7", changefreq: "monthly" },
    { loc: "/chat", priority: "0.6", changefreq: "daily" },
    { loc: "/login", priority: "0.5", changefreq: "monthly" },
    { loc: "/register", priority: "0.5", changefreq: "monthly" },
    { loc: "/profile", priority: "0.5", changefreq: "monthly" },
  ];

  const urlsXml = urls
    .map(
      (url) => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  res.status(200).send(sitemap);
}
