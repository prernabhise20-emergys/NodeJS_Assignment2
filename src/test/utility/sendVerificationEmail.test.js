const transporter=require('../../config/emailConfig.js')
const sendVerificationEmail=require('../../common/utility/sendVerificationEmail.js').default
const {verificationEmail}=require('../../common/constants/mailTemplate.js')
jest.mock('../../config/emailConfig.js', () => ({
  sendMail: jest.fn(),
}));

jest.mock('../../common/constants/mailTemplate.js', () => ({
  verificationEmail: jest.fn(),
}));

describe('sendVerificationEmail', () => {
  const toEmail = 'test@example.com';
  const loginToken = 'mockToken123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send verification email successfully', async () => {
    verificationEmail.mockReturnValue('<p>Verify your email</p>');
    transporter.sendMail.mockResolvedValueOnce();

    await sendVerificationEmail(toEmail, loginToken);

    expect(verificationEmail).toHaveBeenCalledWith(loginToken);
    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: 'Email Verification',
      html: '<p>Verify your email</p>',
    });
  });

  it('should throw error if sending email fails', async () => {
    const error = new Error('SMTP Failure');
    transporter.sendMail.mockRejectedValueOnce(error);
    console.error = jest.fn();

    await expect(sendVerificationEmail(toEmail, loginToken)).rejects.toThrow(
      'Failed to send verification email'
    );

    expect(console.error).toHaveBeenCalledWith('Error sending email:', error);
  });
});
