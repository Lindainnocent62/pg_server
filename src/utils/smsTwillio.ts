import { Twilio } from 'twilio';
import dotenv from 'dotenv';
import nodemailer, { createTestAccount, Transporter } from 'nodemailer';


dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER!;
const client = new Twilio(accountSid, authToken);

const SECRET_KEY = process.env.SECRET_KEY || ' ';
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  if (!cleaned.startsWith('27')) {
    return `+27${cleaned.startsWith('0') ? cleaned.slice(1) : cleaned}`;
  }
  return `+${cleaned}`;
};

export const sendSMS = async (to: string, message: string): Promise<string> => {
  const formattedTo = formatPhoneNumber(to);

  try {
    const response = await client.messages.create({
      body: message,
      from: fromPhoneNumber,
      to: formattedTo,
    });

    return response.sid;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Failed to send SMS');
  }
};

export async function sendEmail(useTestAccount = true, email: string, message: string) {
  try {
      const account = useTestAccount ? await createTestAccount() : null;
      /* const transporter = nodemailer.createTransport({
          host: useTestAccount ? account?.smtp.host ?? EMAIL_HOST : EMAIL_HOST,
          port: useTestAccount ? account?.smtp.port ?? EMAIL_PORT : EMAIL_PORT,
          secure: false,
          auth: {
              user: useTestAccount ? account?.user ?? EMAIL_USER : EMAIL_USER,
              pass: useTestAccount ? account?.pass ?? EMAIL_PASS : EMAIL_PASS,
          },
      }); */

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'hello@cooistudios.com',
          pass: 'ripxadqvdeodkhrg',
        },
      });

      
      await transporter.sendMail({
          from: `"Perfeg Gal" <${useTestAccount ? account?.user ?? EMAIL_USER : EMAIL_USER}>`,
          to: email,
          subject: "Password Reset Request",
          text: message,  
      });
  } catch (err) {
      console.error('Failed to send email', err);
  }
}

export const getSecret = (): string => {
  const secret = SECRET_KEY
  if (!secret) {
    throw new Error("JWT_SECRET is not defined. Please set it in the environment variables.");
  }
  return secret;
};