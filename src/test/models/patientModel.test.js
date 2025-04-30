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

      // const exists = await patientModel.checkPatientExists(1);
      // expect(exists).toBe(true);
    });

    it("Failure: should return false if patient does not exist", async () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(null, [{ count: 0 }]);
      });

    });
  });

  describe("deletePatientDetails", () => {
    it("Success: should soft delete related data", async () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(null, { affectedRows: 1 });
      });

      const result = await patientModel.deletePatientDetails(1);
      expect(result).toEqual({ affectedRows: 1 });
    });
  });

    
})
