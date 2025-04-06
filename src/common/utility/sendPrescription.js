import transporter from '../../config/emailConfig.js';
import path from 'path';

const sendPrescription = async (email, cloudinaryUrl) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Medical Prescription',
      html: `
        <html>
          <body>
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Prescription Uploaded Successfully</h2>
              <p>Your prescription has been uploaded successfully. You can download it from the link below:</p>
              <p><a href="${cloudinaryUrl}">${cloudinaryUrl}</a></p>
              <p>If you have any issues or concerns, please feel free to reach out.</p>
              <p>Thank you!</p>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: 'prescription.xlsx',
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
