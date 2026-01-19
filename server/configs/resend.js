import { Resend } from 'resend';
import dotenv from 'dotenv';

// Force reload dotenv
dotenv.config();


export const resend = new Resend(process.env.RESEND_API_KEY);

