import transporter from '../../config/emailConfig.js';
import {verificationEmail} from '../constants/mailTemplate.js'
const sendVerificationEmail = async (toEmail,loginToken) => {
  try {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Email Verification',
    html: verificationEmail(loginToken),
  };

 
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', toEmail);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');  
  }
};

export default sendVerificationEmail;
