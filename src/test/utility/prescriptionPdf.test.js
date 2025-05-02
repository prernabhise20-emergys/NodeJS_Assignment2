
const puppeteer=require('puppeteer');
const {generatePdf}=require('../../common/utility/prescriptionPdf.js')
const {createPrescription}=require('../../common/utility/createPrescription.js')
const testConstants=require('../utility/test.constants.js').default

jest.mock('puppeteer');
jest.mock('../../common/utility/createPrescription.js');

describe('generatePdf', () => {
  let browserCloseMock;
  let setContentMock;
  let pdfMock;
  let newPageMock;

  const fakePdfBuffer = Buffer.from('PDF content');

  beforeEach(() => {
    jest.clearAllMocks();

    pdfMock = jest.fn().mockResolvedValue(fakePdfBuffer);
    setContentMock = jest.fn().mockResolvedValue();
    browserCloseMock = jest.fn().mockResolvedValue();
    newPageMock = jest.fn().mockResolvedValue({
      setRequestInterception: jest.fn().mockResolvedValue(),
      on: jest.fn(),
      setContent: setContentMock,
      pdf: pdfMock,
    });

    puppeteer.launch.mockResolvedValue({
      newPage: newPageMock,
      close: browserCloseMock,
    });

    createPrescription.mockReturnValue('<html><body>Prescription</body></html>');
  });

  it('should generate a PDF buffer', async () => {
    const result = await generatePdf(
      { medicines: [], morning: [], afternoon: [], evening: [], capacity: [], dosage: [], courseDuration: 0 },
      testConstants.CREATE_PRESCRIPTION.patientName,
      testConstants.CREATE_PRESCRIPTION.appointmentDate,
      testConstants.CREATE_PRESCRIPTION.age,
      testConstants.CREATE_PRESCRIPTION.gender,
      testConstants.CREATE_PRESCRIPTION.doctorName,
      testConstants.CREATE_PRESCRIPTION.specialization,
      testConstants.CREATE_PRESCRIPTION.birthDate
    );

    expect(puppeteer.launch).toHaveBeenCalledWith({ headless: true });
    expect(newPageMock).toHaveBeenCalled();
    expect(setContentMock).toHaveBeenCalledWith('<html><body>Prescription</body></html>');
    expect(pdfMock).toHaveBeenCalledWith({ format: 'A4' });
    expect(browserCloseMock).toHaveBeenCalled();
    expect(result).toBe(fakePdfBuffer);
  });
});
