import resend from "../configs/resend.js";
import VerificationEmail from "../../email/VerificationEmail.js";

export async function sendVerificationEmail(
  email,
  username,
  verifyCode
) {
  if (!resend) {
    console.log("📭 Email skipped — Resend not configured");
    return { success: true };
  }

  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery Message | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    console.log("RESEND RESPONSE:", response);
    return { success: true, message: "Verification email sent" };
  } catch (error) {
    console.error("❌ Email send failed:", error);
    return { success: false, message: "Failed to send verification email" };
  }
}
