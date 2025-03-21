import transporter from '../../config/emailConfig.js';

const sendVerificationEmail = async (toEmail) => {
  try {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Email Verification',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #4CAF50;">Welcome!</h2>
            <p style="text-align: center; font-size: 18px;">Congratulations, you have successfully registered with us!</p>
            <p style="font-size: 16px; color: #555;">
              Thank you for signing up. Your registration has been successfully completed, and we are excited to have you on board. To get started, please verify your email address.
            </p>
            <p style="font-size: 16px; color: #555;">
              <strong>Verification Instructions:</strong><br>
              Please click on the link below to verify your email address and complete your registration process.
            </p>
            <p style="font-size: 14px; color: #888; text-align: center;">
              If you did not sign up for this account, please disregard this email.
            </p>
          </div>
        </body>
      </html>
    `,
  };

 
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', toEmail);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');  
  }
};

export default sendVerificationEmail;
