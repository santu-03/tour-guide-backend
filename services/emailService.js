import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

export const sendEmail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: `"Tour" <${process.env.EMAIL_USER}>`,
    to, subject, html
  });
  logger.info({ messageId: info.messageId }, 'Email sent');
};
