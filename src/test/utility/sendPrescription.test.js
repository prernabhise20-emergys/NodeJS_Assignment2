
const transporter=require('../../config/emailConfig.js')
const sendPrescription=require('../../common/utility/sendPrescription.js').default
const {prescriptionBody}=require('../../common/constants/mailTemplate.js')
const testConstants=require('../utility/test.constants.js').default

jest.mock('../../config/emailConfig.js', () => ({
  sendMail: jest.fn(),
}));

jest.mock('../../common/constants/mailTemplate.js', () => ({
  prescriptionBody: jest.fn().mockReturnValue('<html><body>Prescription</body></html>'),
}));

describe('sendPrescription', () => {
  const email = testConstants.SEND_PRESCRIPTION.email;
  const cloudinaryUrl = testConstants.SEND_PRESCRIPTION.cloudinaryUrl;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send a prescription email successfully', async () => {
    transporter.sendMail.mockResolvedValueOnce();

    await sendPrescription(email, cloudinaryUrl);

    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Medical Prescription',
      html: '<html><body>Prescription</body></html>',
      attachments: [
        {
          filename: 'prescription.pdf',
          path: cloudinaryUrl,
        },
      ],
    });

    expect(prescriptionBody).toHaveBeenCalled();
  });

  it('should throw an error if sending the email fails', async () => {
    const error = new Error('SMTP error');
    transporter.sendMail.mockRejectedValueOnce(error);

    await expect(sendPrescription(email, cloudinaryUrl)).rejects.toThrow('Failed to send prescription email');

    expect(transporter.sendMail).toHaveBeenCalledTimes(1);
  });
});
