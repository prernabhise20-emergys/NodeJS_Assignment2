const cancelledAppointment = require('../../common/utility/cancelledAppointment.js').default; 
const transporter = require('../../config/emailConfig.js');
const { cancelAppointmentMailBody } = require('../../common/constants/mailTemplate.js');
const testConstants=require('../utility/test.constants.js').default
jest.mock('../../config/emailConfig.js', () => ({
  sendMail: jest.fn(),
}));

jest.mock('../../common/constants/mailTemplate.js', () => ({
  cancelAppointmentMailBody: jest.fn(),
}));

describe('cancelledAppointment', () => {
  const email = testConstants.CANCELLED_APPOINTMENT.email;
  const reason =testConstants.CANCELLED_APPOINTMENT.reason;
  const patientName = testConstants.CANCELLED_APPOINTMENT.patientName;
  const appointmentDate = testConstants.CANCELLED_APPOINTMENT.appointmentDate;
  const appointmentTime =testConstants.CANCELLED_APPOINTMENT.appointmentTime;
  const doctorName = testConstants.CANCELLED_APPOINTMENT.doctorName;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Success: should send cancellation email successfully', async () => {
    cancelAppointmentMailBody.mockReturnValue('<p>Cancelled Email Body</p>');
    transporter.sendMail.mockResolvedValueOnce();

    await cancelledAppointment(email, reason, patientName, appointmentDate, appointmentTime, doctorName);

    expect(cancelAppointmentMailBody).toHaveBeenCalledWith(
      patientName,
      reason,
      appointmentDate,
      appointmentTime,
      doctorName
    );

    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Appointment Has Been Cancelled',
      html: '<p>Cancelled Email Body</p>',
    });
  });

  it('Failure: should throw error if email sending fails', async () => {
    const error = new Error('SMTP error');
    transporter.sendMail.mockRejectedValueOnce(error);

    await expect(
      cancelledAppointment(email, reason, patientName, appointmentDate, appointmentTime, doctorName)
    ).rejects.toThrow('Failed to send  email');

    expect(transporter.sendMail).toHaveBeenCalled();
  });
});
