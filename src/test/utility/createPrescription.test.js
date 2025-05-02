const {createPrescription}=require('../../common/utility/createPrescription.js')
const testConstants=require('../utility/test.constants.js').default

describe('createPrescription', () => {
  const sampleData = testConstants.SAMPLE_DATA;

  const patientName = testConstants.CREATE_PRESCRIPTION.patientName;
  const appointmentDate = testConstants.CREATE_PRESCRIPTION.appointmentDate;
  const age = testConstants.CREATE_PRESCRIPTION.age;
  const gender = testConstants.CREATE_PRESCRIPTION.gender;
  const doctorName = testConstants.CREATE_PRESCRIPTION.doctorName;
  const specialization = testConstants.CREATE_PRESCRIPTION.specialization;
  const birthDate = testConstants.CREATE_PRESCRIPTION.birthDate;

  it('should generate an HTML string with prescription details', () => {
    const html = createPrescription(
      sampleData,
      patientName,
      appointmentDate,
      age,
      gender,
      doctorName,
      specialization,
      birthDate
    );

    expect(html).toContain('City Care Medical Center');
    expect(html).toContain(patientName);
    expect(html).toContain(appointmentDate);
    expect(html).toContain(age.toString());
    expect(html).toContain(gender);
    expect(html).toContain(doctorName);
    expect(html).toContain(specialization);
    expect(html).toContain(sampleData.medicines[0]);
    expect(html).toContain(sampleData.capacity[1]);
    expect(html).toContain('Course_Duration');
  });

  it('should handle morning, afternoon, and evening timings correctly', () => {
    const html = createPrescription(
      sampleData,
      patientName,
      appointmentDate,
      age,
      gender,
      doctorName,
      specialization,
      birthDate
    );

    expect(html).toContain('before meal'); 
    expect(html).toContain('before and after meal'); 
    expect(html).toContain('no'); 
    expect(html).toContain('after meal'); 
  });

  it('should generate a table row for each medicine', () => {
    const html = createPrescription(
      sampleData,
      patientName,
      appointmentDate,
      age,
      gender,
      doctorName,
      specialization,
      birthDate
    );

    const rowCount = (html.match(/<tr>/g) || []).length;
    expect(rowCount).toBe(1 + sampleData.medicines.length);
  });
});
