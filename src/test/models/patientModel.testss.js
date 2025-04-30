import * as patientService from "../services/patientService.js";
import db from "../db/connection.js";

jest.mock("../db/connection.js");

describe("Patient Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getPatientInfo", () => {
    it("should resolve patient data with grouped documents", async () => {
      const mockRows = [
        {
          patient_id: 1,
          patient_name: "John",
          first_name: "John",
          last_name: "Doe",
          gender: "Male",
          mobile_number: "1234567890",
          date_of_birth: "2000-01-01",
          age: 24,
          weight: 70,
          height: 180,
          bmi: 21.6,
          country_of_origin: "USA",
          is_diabetic: false,
          cardiac_issue: false,
          blood_pressure: "Normal",
          father_name: "Dad",
          father_age: 60,
          mother_name: "Mom",
          mother_age: 58,
          father_country_origin: "USA",
          mother_country_origin: "USA",
          father_diabetic: false,
          father_cardiac_issue: false,
          father_bp: "Normal",
          mother_diabetic: false,
          mother_cardiac_issue: false,
          mother_bp: "Normal",
          disease_type: "Diabetes",
          disease_description: "Type 1",
          document_type: "Report",
          document_url: "http://example.com/report.pdf",
          appointment_status: "Scheduled",
          doctor_id: 2,
        },
      ];

      db.query.mockImplementation((query, id, callback) => {
        callback(null, mockRows);
      });

      const data = await patientService.getPatientInfo(1);
      expect(data).toHaveLength(1);
      expect(data[0].documents).toEqual([
        { document_type: "Report", document_url: "http://example.com/report.pdf" },
      ]);
    });

    it("should reject on db error", async () => {
      db.query.mockImplementation((query, id, callback) => {
        callback(new Error("DB Error"), null);
      });

      await expect(patientService.getPatientInfo(1)).rejects.toThrow("DB Error");
    });
  });

  describe("createPersonalDetails", () => {
    it("should insert personal info and resolve result", async () => {
      db.query.mockImplementation((query, data, callback) => {
        callback(null, { insertId: 1 });
      });

      const result = await patientService.createPersonalDetails(
        {
          patient_name: "Alice",
          date_of_birth: "1990-01-01",
          gender: "Female",
          height: 5.5,
          weight: 60,
          is_diabetic: false,
          cardiac_issue: false,
          blood_pressure: "Normal",
          country_of_origin: "India",
        },
        1001,
        "alice@example.com"
      );

      expect(result).toEqual({ insertId: 1 });
    });
  });

  describe("checkPatientExists", () => {
    it("should return true if patient exists", async () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(null, [{ count: 1 }]);
      });

      const exists = await patientService.checkPatientExists(1);
      expect(exists).toBe(true);
    });

    it("should return false if patient does not exist", async () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(null, [{ count: 0 }]);
      });

      const exists = await patientService.checkPatientExists(999);
      expect(exists).toBe(false);
    });
  });

  describe("deletePatientDetails", () => {
    it("should soft delete related data", async () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(null, { affectedRows: 1 });
      });

      const result = await patientService.deletePatientDetails(1);
      expect(result).toEqual({ affectedRows: 1 });
    });
  });
});
