import Queue from 'bull';
import { SMTPClient } from 'emailjs';
import dotenv from 'dotenv';

dotenv.config();

const emailQueue = new Queue('email', 'redis://127.0.0.1:6379');

emailQueue.process(async (job) => { 
  const { email, subject, content } = job.data;

  const client = new SMTPClient({
    host: 'smtp.gmail.com',
    user: process.env.EMAIL_USER,
    ssl: true,
    password: process.env.EMAIL_PASS
  });

  try {
    const message = await client.sendAsync({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: content,
      attachment: [
        { data: `<html>${content}</html>`, alternative: true },
      ],
    }); 

    console.log(message);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
});

emailQueue.on('completed', job => {
  console.log(`Email job ${job.id} completed successfully`);
});

emailQueue.on('failed', (job, err) => {
  console.error(`Email job ${job.id} failed with error:`, err);
});


export default emailQueue;