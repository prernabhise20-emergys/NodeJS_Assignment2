const transporter=require('../../config/emailConfig.js')
const sendRegisterCode=require('../../common/utility/sendRegisterCode.js').default
const {sendUserCode}=require('../../common/constants/mailTemplate.js')
const testConstants=require('../utility/test.constants.js').default

jest.mock('../../config/emailConfig.js', () => ({
  sendMail: jest.fn(),
}));

jest.mock('../../common/constants/mailTemplate.js', () => ({
  sendUserCode: jest.fn(),
}));

describe('sendRegisterCode', () => {
  const email = testConstants.SEND_REGISTER_CODE.email;
  const name = testConstants.SEND_REGISTER_CODE.name;
  const code = testConstants.SEND_REGISTER_CODE.code;
  const user_password = testConstants.SEND_REGISTER_CODE.user_password;
  const loginToken = testConstants.SEND_REGISTER_CODE.loginToken;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send registration code email successfully', async () => {
    sendUserCode.mockReturnValue('<p>Email Body</p>');
    transporter.sendMail.mockResolvedValueOnce();

    await sendRegisterCode(email, name, code, user_password, loginToken);

    expect(sendUserCode).toHaveBeenCalledWith(email, name, code, user_password, loginToken);
    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Unique User Code Has Been Generator',
      html: '<p>Email Body</p>',
    });
  });

  it('should throw error if email sending fails', async () => {
    const error = new Error('SMTP failure');
    transporter.sendMail.mockRejectedValueOnce(error);

    await expect(
      sendRegisterCode(email, name, code, user_password, loginToken)
    ).rejects.toThrow('Failed to send  email');

    expect(sendUserCode).toHaveBeenCalledWith(email, name, code, user_password, loginToken);
    expect(transporter.sendMail).toHaveBeenCalledTimes(1);
  });
});
