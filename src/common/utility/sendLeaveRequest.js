import transporter from '../../config/emailConfig.js';
import { sendLeaveRequestBody } from '../constants/mailTemplate.js';
const sendLeaveRequest = async (email,doctor_name,start_date,end_date,leave_reason) => {
  
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Request For Leave',
      html: sendLeaveRequestBody(doctor_name,start_date,end_date,leave_reason),
    };

    await transporter.sendMail(mailOptions);


  } catch (error) {
    throw new Error('Failed to send leave request email');
  }
};

export default sendLeaveRequest;
