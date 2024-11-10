import { serve } from "bun";

serve({
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // เส้นทางหลัก - เสิร์ฟ index.html
    if (path === "/") {
      return new Response(Bun.file("index.html"), {
        headers: { "Content-Type": "text/html" },
      });
    }

    // เส้นทางสำหรับไฟล์ CSS
    if (path === "/style.css") {
      return new Response(Bun.file("style.css"), {
        headers: { "Content-Type": "text/css" },
      });
    }

    // เส้นทางสำหรับไฟล์รูปภาพ
    if (path.startsWith("/image/")) {
      const imagePath = `.${path}`;
      return new Response(Bun.file(imagePath), {
        headers: { "Content-Type": "image/jpeg" },
      });
    }

    // กรณีหาไฟล์ไม่พบ
    return new Response("404 Not Found", { status: 404 });
  },
  port: 3000,
});

console.log("Bun server running on http://localhost:3000");
