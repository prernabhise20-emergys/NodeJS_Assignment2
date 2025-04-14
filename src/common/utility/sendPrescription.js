import transporter from '../../config/emailConfig.js';
import { prescriptionBody } from '../constants/mailTemplate.js';
const sendPrescription = async (email, cloudinaryUrl) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Medical Prescription',
      html: prescriptionBody(),
      attachments: [
        {
          filename: 'prescription.pdf',
          path: cloudinaryUrl, 
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    console.log('Prescription email sent successfully');
  } catch (error) {
    console.error('Error sending prescription email:', error);
    throw new Error('Failed to send prescription email');
  }
};

export default sendPrescription;
