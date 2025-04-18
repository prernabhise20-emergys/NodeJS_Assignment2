import transporter from '../../config/emailConfig.js';
import { approveRequestMailBody } from '../constants/mailTemplate.js';
const approveRequest = async (email, patient_name, appointment_date, appointment_time, doctorName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Appointment Confirmation',
      html: approveRequestMailBody( patient_name, appointment_date, appointment_time, doctorName),
    };

    await transporter.sendMail(mailOptions);

    console.log('Appointment Confirmation email sent');

  } catch (error) {
    console.error('Error sending:', error);
    throw new Error('Failed to send  email');
  }
};

export default approveRequest;
