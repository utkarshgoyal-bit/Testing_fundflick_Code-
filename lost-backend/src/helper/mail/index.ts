import nodemailer, { Transporter } from 'nodemailer';

interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const transporter: Transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.OUTLOOK_USER,
    pass: process.env.OUTLOOK_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

export const sendEmail = async (options: MailOptions): Promise<void> => {
  try {
    const mailOptions = {
      from: `<${process.env.OUTLOOK_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text || '',
      html: options.html || '',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
