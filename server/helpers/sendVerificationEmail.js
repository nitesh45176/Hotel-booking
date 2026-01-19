import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/VerificationEmail";

export async function sendVerificationEmail(
    email,
    username,
    verifyCode
) {
    try {
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: "mishranitesh45176@gmail.com",
            subject: 'Mystry message | Verification code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        console.log("RESEND RESPONSE:", response);
        return { success: true, message: 'Verification email send successfully' }
    } catch (emailError) {
        console.log("Error sending verification email", emailError)
        return { success: false, message: 'Failed to send verification email' }
    }
}