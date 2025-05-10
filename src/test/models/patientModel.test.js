const patientModel=require('../../models/patientModel')
const db=require('../../db/connection')
const bcrypt=require('bcryptjs')
const testConstants = require("../models/test.model.constants")
const patientController=require('../../controllers/patientController')
jest.mock('../../db/connection');
jest.mock('bcryptjs');
jest.mock('../../db/connection', () => ({
  query: jest.fn(),
}));
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('Patient Model Test Cases',()=>{

  describe("getPatientInfo", () => {
    it("Success: should resolve patient data with grouped documents", async () => {
      const mockRows = testConstants.getPatientInfo;

      db.query.mockImplementation((query, id, callback) => {
        callback(null, mockRows);
      });

      const data = await patientModel.getPatientInfo(1);
      expect(data).toHaveLength(1);
      expect(data[0].documents).toEqual(testConstants.getPatientInfoRes);
    });

    it("Failure: should reject on db error", async () => {
      db.query.mockImplementation((query, id, callback) => {
        callback(new Error("DB Error"), null);
      });

      await expect(patientModel.getPatientInfo(1)).rejects.toThrow("DB Error");
    });
  });

  describe("createPersonalDetails", () => {
    it("Success: should insert personal info and resolve result", async () => {
      db.query.mockImplementation((query, data, callback) => {
        callback(null, { insertId: 1 });
      });

      const result = await patientModel.createPersonalDetails(
       testConstants.createPersonalDetails,
        testConstants.createPersonalDetailsReq.id,
        testConstants.createPersonalDetailsReq.email
      );

      expect(result).toEqual({ insertId: 1 });
    });
  });

  describe("checkPatientExists", () => {
    it("Success: should return true if patient exists", async () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(null, [{ count: 1 }]);
      });

   
    });

    it("Failure: should return false if patient does not exist", async () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(null, [{ count: 0 }]);
      });

    });
  });

 

describe('getDeletePatientInfo', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return structured patient data with documents for a valid email', async () => {
    const mockEmail = 'test@example.com';
    const mockDbResult = [
      {
        patient_id: 1,
        patient_name: 'John',
        first_name: 'Alex',
        last_name: 'Doe',
        gender: 'Male',
        mobile_number: '1234567890',
        date_of_birth: '1990-01-01',
        age: 34,
        weight: '75',
        height: '175',
        bmi: '24.5',
        country_of_origin: 'India',
        is_diabetic: 0,
        cardiac_issue: 0,
        blood_pressure: 'Normal',
        father_name: 'Father A',
        father_age: 60,
        mother_name: 'Mother A',
        mother_age: 55,
        father_country_origin: 'India',
        mother_country_origin: 'India',
        father_diabetic: 1,
        father_cardiac_issue: 0,
        father_bp: 'High',
        mother_diabetic: 0,
        mother_cardiac_issue: 1,
        mother_bp: 'Normal',
        disease_type: 'Diabetes',
        disease_description: 'Type 2',
        document_type: 'Aadhar',
        document_url: 'http://example.com/aadhar'
      }
    ];

    db.query.mockImplementation((sql, email, callback) => {
      callback(null, mockDbResult);
    });

    const result = await patientModel.getDeletePatientInfo(mockEmail);

    expect(result).toEqual([
      {
        patient_id: 1,
        patient_name: 'John',
        first_name: 'Alex',
        last_name: 'Doe',
        gender: 'Male',
        mobile_number: '1234567890',
        date_of_birth: '1990-01-01',
        age: 34,
        weight: '75',
        height: '175',
        bmi: '24.5',
        country_of_origin: 'India',
        is_diabetic: 0,
        cardiac_issue: 0,
        blood_pressure: 'Normal',
        father_name: 'Father A',
        father_age: 60,
        mother_name: 'Mother A',
        mother_age: 55,
        father_country_origin: 'India',
        mother_country_origin: 'India',
        father_diabetic: 1,
        father_cardiac_issue: 0,
        father_bp: 'High',
        mother_diabetic: 0,
        mother_cardiac_issue: 1,
        mother_bp: 'Normal',
        disease_type: 'Diabetes',
        disease_description: 'Type 2',
        documents: [
          {
            document_type: 'Aadhar',
            document_url: 'http://example.com/aadhar'
          }
        ]
      }
    ]);

    expect(db.query).toHaveBeenCalledTimes(1);
  });

  it('should reject on database error', async () => {
    db.query.mockImplementation((sql, email, callback) => {
      callback(new Error('DB error'), null);
    });

    await expect(patientModel.getDeletePatientInfo('test@example.com')).rejects.toThrow('DB error');
  });
});


describe('getPersonalInfo', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return formatted personal info for a valid patient ID', async () => {
    const mockPatientId = 1;
    const mockResult = [{
      patient_name: 'Jane Doe',
      date_of_birth: '1995-05-10',
      gender: 'Female',
      age: 29,
      weight: '60',
      height: '165',
      bmi: '22.0',
      country_of_origin: 'India',
      is_diabetic: 0,
      cardiac_issue: 0,
      blood_pressure: 'Normal'
    }];

    db.query.mockImplementation((sql, params, callback) => {
      callback(null, mockResult);
    });

    const result = await patientModel.getPersonalInfo(mockPatientId);

    expect(result).toEqual([{
      ...mockResult[0],
      weight: 60,
      height: 165,
      bmi: 22.0
    }]);

    expect(db.query).toHaveBeenCalledWith(expect.any(String), [mockPatientId], expect.any(Function));
  });

  it('should handle empty result', async () => {
    db.query.mockImplementation((sql, params, callback) => {
      callback(null, []);
    });

    const result = await patientModel.getPersonalInfo(2);
    expect(result).toEqual([]);
  });

  it('should reject on database error', async () => {
    db.query.mockImplementation((sql, params, callback) => {
      callback(new Error('Query failed'), null);
    });

    await expect(patientModel.getPersonalInfo(1)).rejects.toThrow('Query failed');
  });
});


describe('Model Function Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('deleteFamilyInfo - should resolve with result', async () => {
    db.query.mockImplementation((query, param, cb) => cb(null, 'deleted'));
    const result = await patientModel.deleteFamilyInfo(1);
    expect(result).toBe('deleted');
    expect(db.query).toHaveBeenCalledWith(expect.any(String), 1, expect.any(Function));
  });

  test('getDiseaseInfo - should return disease info', async () => {
    db.query.mockImplementation((query, param, cb) => cb(null, [{ disease_type: 'Diabetes' }]));
    const result = await patientModel.getDiseaseInfo(2);
    expect(result).toEqual([{ disease_type: 'Diabetes' }]);
  });

  test('addDiseaseData - should insert data', async () => {
    const data = { disease_type: 'Asthma', patient_id: 3 };
    db.query.mockImplementation((query, param, cb) => cb(null, { insertId: 1 }));
    const result = await patientModel.addDiseaseData(data);
    expect(result).toEqual({ insertId: 1 });
  });

  test('updateDiseaseDetails - should update disease details', async () => {
    db.query.mockImplementation((query, params, cb) => cb(null, { affectedRows: 1 }));
    const result = await patientModel.updateDiseaseDetails({ disease_type: 'Updated' }, 3);
    expect(result).toEqual({ affectedRows: 1 });
  });

  test('deleteDiseaseDetails - should mark disease as deleted', async () => {
    db.query.mockImplementation((query, param, cb) => cb(null, { affectedRows: 1 }));
    const result = await patientModel.deleteDiseaseDetails(4);
    expect(result).toEqual({ affectedRows: 1 });
  });

  test('getUploadInfo - should return documents', async () => {
    db.query.mockImplementation((query, param, cb) => cb(null, [{ document_type: 'X-ray' }]));
    const result = await patientModel.getUploadInfo(5);
    expect(result).toEqual([{ document_type: 'X-ray' }]);
  });

  test('saveDocument - should insert document', async () => {
    db.query.mockImplementation((query, param, cb) => cb(null, { insertId: 99 }));
    const docData = { document_type: 'PDF', document_url: 'url', patient_id: 1 };
    const result = await patientModel.saveDocument(docData);
    expect(result).toEqual({ insertId: 99 });
  });

  test('checkNumberOfDocument - should return true if > 3 docs', async () => {
    db.query.mockImplementation((query, param, cb) => cb(null, [1, 2, 3, 4]));
    const result = await patientModel.checkNumberOfDocument(1);
    expect(result).toBe(true);
  });

  test('checkDocumentExists - should return true if document exists', async () => {
    db.query.mockImplementation((query, params, cb) => cb(null, [{}]));
    const result = await patientModel.checkDocumentExists('PDF', 2);
    expect(result).toBe(true);
  });

  test('checkAlreadyExist - should return true if email exists', async () => {
    db.query.mockImplementation((query, param, cb) => cb(null, [{}]));
    const result = await patientModel.checkAlreadyExist('test@example.com');
    expect(result).toBe(true);
  });

  test('modifyDocument - should update document', async () => {
    db.query.mockImplementation((query, values, cb) => cb(null, { affectedRows: 1 }));
    const result = await patientModel.modifyDocument({
      document_url: 'new-url',
      patient_id: 3,
      document_type: 'PDF'
    });
    expect(result).toEqual({ affectedRows: 1 });
  });

  test('getDocumentByPatientIdAndType - should fetch document', async () => {
    db.query.mockImplementation((query, values, cb) => cb(null, [{ document_type: 'MRI' }]));
    const result = await patientModel.getDocumentByPatientIdAndType(4, 'MRI');
    expect(result).toEqual([{ document_type: 'MRI' }]);
  });

  test('createDiseaseInformation - should insert disease info', async () => {
    db.query.mockImplementation((query, values, cb) => cb(null, { insertId: 10 }));
    const result = await patientModel.createDiseaseInformation({
      patient_id: 2,
      disease_type: 'Cancer',
      disease_description: 'Early stage'
    });
    expect(result).toEqual({ insertId: 10 });
  });
});

    
})
