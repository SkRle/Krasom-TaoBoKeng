/**
 * ขอ GOOGLE_REFRESH_TOKEN ครั้งเดียว (รันด้วย `npm run google:token`)
 *
 * 1. ใส่ GOOGLE_CLIENT_ID และ GOOGLE_CLIENT_SECRET ใน .env
 * 2. รันสคริปต์ เปิดลิงก์ที่แสดง แล้วล็อกอินด้วย krasomtaobokeng@gmail.com
 * 3. คัดลอก refresh token ที่ได้ไปใส่ GOOGLE_REFRESH_TOKEN ใน .env
 */
import { createServer } from "node:http";
import { config } from "dotenv";
import { google } from "googleapis";

config({ path: [".env.local", ".env"], quiet: true });

const PORT = 53682;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error("กรุณาใส่ GOOGLE_CLIENT_ID และ GOOGLE_CLIENT_SECRET ใน .env ก่อน");
  process.exit(1);
}

const oauth2 = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  // ต้องใช้สิทธิ์ drive เต็ม เพื่อเขียนไฟล์ลงโฟลเดอร์ที่มีอยู่แล้ว
  scope: ["https://www.googleapis.com/auth/drive"],
  login_hint: "krasomtaobokeng@gmail.com",
});

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", REDIRECT_URI);
  if (url.pathname !== "/oauth2callback") {
    res.writeHead(404).end();
    return;
  }
  const code = url.searchParams.get("code");
  if (!code) {
    res.writeHead(400).end("ไม่พบ code");
    return;
  }
  try {
    const { tokens } = await oauth2.getToken(code);
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("สำเร็จ กลับไปดูที่ terminal ได้เลย");
    console.log("\nGOOGLE_REFRESH_TOKEN=" + tokens.refresh_token + "\n");
  } catch (error) {
    res.writeHead(500).end("ขอ token ไม่สำเร็จ");
    console.error(error);
  } finally {
    server.close();
  }
});

server.listen(PORT, () => {
  console.log("เปิดลิงก์นี้ในเบราว์เซอร์แล้วล็อกอินด้วย krasomtaobokeng@gmail.com:\n");
  console.log(authUrl + "\n");
});
