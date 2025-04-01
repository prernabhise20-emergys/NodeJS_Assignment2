import transporter from '../../config/emailConfig.js';

const sendOtpToEmail = async (email, otp) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        html: `
          <html>
            <body>
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Password Reset Request</h2>
                <p>Dear User,</p>
                <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
                <p style="font-size: 24px; font-weight: bold; color: #333;">${otp}</p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Thank you,</p>
              </div>
            </body>
          </html>
        `,
      };
  
      await transporter.sendMail(mailOptions);
  
  console.log('otp email sent');
  
    } catch (error) {
      console.error('Error sending OTP:', error);
    throw new Error('Failed to send otp email');  
}
  };
  export default sendOtpToEmail;
