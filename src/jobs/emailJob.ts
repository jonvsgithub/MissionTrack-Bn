import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: false,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass
  }
});

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (payload: EmailPayload): Promise<void> => {
  try {
    await transporter.sendMail({
      from: env.smtp.fromEmail,
      ...payload
    });
    logger.info(`Email queued to ${payload.to}`);
  } catch (error) {
    logger.error('Failed to send email', { error });
  }
};



