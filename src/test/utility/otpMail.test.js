const sendOtpToEmail = require('../../common/utility/otpMail.js').default;
const transporter = require('../../config/emailConfig.js');
const { otpMailBody } = require('../../common/constants/mailTemplate.js');
const testConstants=require('../utility/test.constants.js').default


jest.mock('../../config/emailConfig.js', () => ({
  sendMail: jest.fn(),
}));

jest.mock('../../common/constants/mailTemplate.js', () => ({
  otpMailBody: jest.fn(),
}));

describe('sendOtpToEmail', () => {
  const email = testConstants.SEND_OTP.email;
  const name = testConstants.SEND_OTP.name;
  const otp = testConstants.SEND_OTP.otp;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send OTP email successfully', async () => {
    otpMailBody.mockReturnValue('<p>Your OTP is 123456</p>');
    transporter.sendMail.mockResolvedValueOnce();

    await sendOtpToEmail(email, name, otp);

    expect(otpMailBody).toHaveBeenCalledWith(name, otp);
    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      html: '<p>Your OTP is 123456</p>',
    });
  });

  it('should throw error when email sending fails', async () => {
    const error = new Error('SMTP error');
    otpMailBody.mockReturnValue('<p>Your OTP is 123456</p>');
    transporter.sendMail.mockRejectedValueOnce(error);

    await expect(sendOtpToEmail(email, name, otp)).rejects.toThrow('Failed to send OTP email');

    expect(transporter.sendMail).toHaveBeenCalled();
  });
});
