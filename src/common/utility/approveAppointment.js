// import transporter from '../../config/emailConfig.js';
// import { approveRequestMailBody,notifyDoctorMailBody } from '../constants/mailTemplate.js';
// const approveRequest = async (email, patient_name, appointment_date, appointment_time,name) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Appointment Confirmation',
//       html: approveRequestMailBody( patient_name, appointment_date, appointment_time,name),
//     };

//     await transporter.sendMail(mailOptions);


//   } catch (error) {
//     throw new Error('Failed to send  email');
//   }
// };

// const approveAppointmentDoctorNotify = async (name,patient_name, appointment_date, appointment_time,doctor_email) => {
//   try {

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: doctor_email,
//       subject: 'Appointment Confirmation Notification',
//       html: notifyDoctorMailBody(name,patient_name, appointment_date, appointment_time),
//     };

//     await transporter.sendMail(mailOptions);

//   } catch (error) {
//     throw new Error('Failed to send doctor email');
//   }
// };
// export  {approveRequest,approveAppointmentDoctorNotify};



import transporter from '../../config/emailConfig.js';
import { approveRequestMailBody, notifyDoctorMailBody } from '../constants/mailTemplate.js';

const approveRequest = async (email, patient_name, appointment_date, appointment_time, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Appointment Confirmation',
      html: approveRequestMailBody(patient_name, appointment_date, appointment_time, name),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Failed to send email to patient');
  }
};

const approveAppointmentDoctorNotify = async (name, patient_name, appointment_date, appointment_time, doctor_email) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: doctor_email,
      subject: 'Appointment Confirmation Notification',
      html: notifyDoctorMailBody(name, patient_name, appointment_date, appointment_time),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Failed to send doctor email');
  }
};

export { approveRequest, approveAppointmentDoctorNotify };
