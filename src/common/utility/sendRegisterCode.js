import transporter from '../../config/emailConfig.js';
import { sendUserCode } from '../constants/mailTemplate.js';
const sendRegisterCode = async (email,name,code,user_password,loginToken) => {
  
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Unique User Code Has Been Generator',
      html: sendUserCode(email,name,code,user_password,loginToken),
    };

    await transporter.sendMail(mailOptions);

    console.log('Registration Code email sent');

  } catch (error) {
    console.error('Error sending:', error);
    throw new Error('Failed to send  email');
  }
};

export default sendRegisterCode;
