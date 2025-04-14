const otpMailBody = (name, otp) => {
  return `
    <html>
      <body>
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Password Reset Request</h2>
          <p>Dear ${name},</p>
          <p>You have requested to reset your password. Please use the following ${otp} to proceed:</p>
          <p style="font-size: 24px; font-weight: bold; color: #333;">${otp}</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Thank you,</p>
        </div>
      </body>
    </html>
  `;
};

const verificationEmail =() => {
  return`
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
    `
  }
 
  
const prescriptionBody = () => {
return `
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
      `
};

const approveRequestMailBody =( patientName, appointmentDate, appointmentTime, doctorName) => {
 return`
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

        `
   
};
export {otpMailBody,verificationEmail,prescriptionBody,approveRequestMailBody}