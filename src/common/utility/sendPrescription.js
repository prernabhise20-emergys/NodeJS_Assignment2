import transporter from '../../config/emailConfig.js';

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
              <h4>Hello,</h4>
              <p>Your prescription has been uploaded successfully. You can download it from the attachment below:</p>
              <p>If you have any issues or concerns, please feel free to reach out.</p>
              <p>Thank you!</p>
            </div>
          </body>
        </html>
      `,
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
