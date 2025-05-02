import transporter from '../../config/emailConfig.js';

import {otpMailBody} from '../constants/mailTemplate.js'
const sendOtpToEmail = async (email, name, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: email,
      subject: 'Password Reset OTP', 
      html: otpMailBody(name, otp), 
    };

    await transporter.sendMail(mailOptions); 
    console.log('OTP email sent successfully');

  } catch (error) {
    throw new Error('Failed to send OTP email');
  }
};

export default sendOtpToEmail;

