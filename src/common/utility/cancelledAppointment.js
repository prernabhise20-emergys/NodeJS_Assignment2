import transporter from '../../config/emailConfig.js';
import { cancelAppointmentMailBody } from '../constants/mailTemplate.js';
const cancelledAppointment = async (email,reason, patientName, appointmentDate, appointmentTime, doctorName) => {
  
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Appointment Has Been Cancelled',
      html: cancelAppointmentMailBody( patientName,reason, appointmentDate, appointmentTime, doctorName),
    };

    await transporter.sendMail(mailOptions);

    console.log('Appointment Cancelled email sent');

  } catch (error) {
    throw new Error('Failed to send  email');
  }
};

export default cancelledAppointment;
