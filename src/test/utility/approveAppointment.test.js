const approveRequest = require('../../common/utility/approveAppointment.js').default; 
const transporter = require('../../config/emailConfig.js');
const { approveRequestMailBody } = require('../../common/constants/mailTemplate.js');
const testConstants=require('../utility/test.constants.js').default
jest.mock('../../config/emailConfig.js', () => ({
  sendMail: jest.fn(),
}));

jest.mock('../../common/constants/mailTemplate.js', () => ({
  approveRequestMailBody: jest.fn(),
}));

describe('approveRequest', () => {
  const email =testConstants.APPROVE_APPOINTMENT.email;
  const patient_name = testConstants.APPROVE_APPOINTMENT.patient_name;
  const appointment_date = testConstants.APPROVE_APPOINTMENT.appointment_date;
  const appointment_time = testConstants.APPROVE_APPOINTMENT.appointment_time;
  const doctorName = testConstants.APPROVE_APPOINTMENT.doctorName;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Success: should send email successfully', async () => {
    approveRequestMailBody.mockReturnValue('<p>Email Body</p>');
    transporter.sendMail.mockResolvedValueOnce();

    await approveRequest(email, patient_name, appointment_date, appointment_time, doctorName);

    expect(approveRequestMailBody).toHaveBeenCalledWith(
      patient_name,
      appointment_date,
      appointment_time,
      doctorName
    );
    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Appointment Confirmation',
      html: '<p>Email Body</p>',
    });
  });

  it('Failure: should throw error if email sending fails', async () => {
    const error = new Error('SMTP error');
    transporter.sendMail.mockRejectedValueOnce(error);

    await expect(
      approveRequest(email, patient_name, appointment_date, appointment_time, doctorName)
    ).rejects.toThrow('Failed to send  email');

    expect(transporter.sendMail).toHaveBeenCalled();
  });
});
