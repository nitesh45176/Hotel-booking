import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

let resend = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log("✅ Resend initialized");
} else {
  console.warn("⚠️ RESEND_API_KEY missing. Emails disabled.");
}

export default resend;
