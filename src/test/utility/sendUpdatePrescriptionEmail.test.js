const transporter=require('../../config/emailConfig.js')
const sendUpdatePrescriptionEmail=require('../../common/utility/sendUpdatePrescriptionEmail.js').default
const {updatedPrescriptionBody}=require('../../common/constants/mailTemplate.js')
jest.mock('../../config/emailConfig.js', () => ({
  sendMail: jest.fn(),
}));

jest.mock('../../common/constants/mailTemplate.js', () => ({
  updatedPrescriptionBody: jest.fn(),
}));

describe('sendUpdatePrescriptionEmail', () => {
  const email = 'test@example.com';
  const prescriptionUrl = 'https://example.com/prescription.pdf';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send updated prescription email successfully', async () => {
    updatedPrescriptionBody.mockReturnValue('<p>Updated Prescription</p>');
    transporter.sendMail.mockResolvedValueOnce();

    await sendUpdatePrescriptionEmail(email, prescriptionUrl);

    expect(updatedPrescriptionBody).toHaveBeenCalled();
    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Prescription Has Been Updated',
      html: '<p>Updated Prescription</p>',
      attachments: [
        {
          filename: 'prescription.pdf',
          path: prescriptionUrl,
        },
      ],
    });
  });

  it('should log error if email sending fails', async () => {
    const error = new Error('SMTP error');
    transporter.sendMail.mockRejectedValueOnce(error);
    console.error = jest.fn(); // mock console.error

    await sendUpdatePrescriptionEmail(email, prescriptionUrl);

    expect(console.error).toHaveBeenCalledWith('Error sending email:', error);
  });
});
