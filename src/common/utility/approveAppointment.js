import transporter from '../../config/emailConfig.js';

const approveRequest = async (email,patientName,appointmentDate,appointmentTime,doctorName) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Appointment Confirmation',
        html: `
        <html>
  <body>
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <p>Dear ${patientName},</p>
      <p>We are pleased to inform you that your appointment request has been approved. Here are the details:</p>
      <ul>
        <li><strong>Patient Name:</strong> ${patientName}</li>
        <li><strong>Date:</strong> ${appointmentDate}</li>
        <li><strong>Time:</strong> ${appointmentTime}</li>
        <li><strong>Doctor Name:</strong> ${doctorName}</li>
      </ul>
      <p>Please let us know if you have any questions or require further assistance.</p>
      <p>Thank you</p>
    </div>
  </body>
</html>

        `,
      };
  
      await transporter.sendMail(mailOptions);
  
  console.log('Appointment Confirmation email sent');
  
    } catch (error) {
      console.error('Error sending:', error);
    throw new Error('Failed to send  email');  
}
  };
  export default approveRequest;
