import transporter from '../../config/emailConfig.js';
import {updatedPrescriptionBody} from "../constants/mailTemplate.js";

const sendUpdatePrescriptionEmail = async (email, prescriptionUrl) => {
    try {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Prescription Has Been Updated',
        html: updatedPrescriptionBody(),
        attachments: [
            {
              filename: 'prescription.pdf',
              path: prescriptionUrl, 
            },
          ],
    };

 
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default sendUpdatePrescriptionEmail;