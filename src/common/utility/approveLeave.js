import transporter from '../../config/emailConfig.js';
import { leaveApproveBody } from '../constants/mailTemplate.js';
const leaveApprove = async (d_email,d_name,start_date,end_date,leave_approver) => {
  
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: d_email,
      subject: 'Your Leave Has Been Approved',
      html: leaveApproveBody(d_name,start_date,end_date,leave_approver)
    };

    await transporter.sendMail(mailOptions);


  } catch (error) {
    throw new Error('Failed to send approve leave email');
  }
};

export default leaveApprove;
