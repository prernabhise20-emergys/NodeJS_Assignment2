const userModel=require('../../models/userModel')
const db=require('../../db/connection')
const bcrypt=require('bcryptjs')
const testConstants = require("../models/test.model.constants")

jest.mock('../../db/connection');
jest.mock('bcryptjs');
jest.mock('../../db/connection', () => ({
  query: jest.fn(),
}));
describe('User Model Functions', () => {

describe('getUserData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user data when db query succeeds', async () => {
    const mockResult = [
      {
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        mobile_number: '1234567890'
      }
    ];

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockResult);
    });

    const result = await userModel.getUserData(1);

    expect(db.query).toHaveBeenCalledWith(expect.any(String), 1, expect.any(Function));
    expect(result).toEqual(mockResult);
  });

  it('should throw an error when db query fails', async () => {
    const mockError = new Error('Database error');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockError, null);
    });

    await expect(userModel.getUserData(1)).rejects.toThrow('Database error');
    expect(db.query).toHaveBeenCalledWith(expect.any(String), 1, expect.any(Function));
  });
});

describe('getDoctorData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return doctor data when db query succeeds', async () => {
    const mockResult = [
      {
        email: 'doctor@example.com',
        first_name: 'Alice',
        last_name: 'Smith',
        mobile_number: '9876543210',
        doctorInTime: '09:00',
        doctorOutTime: '17:00',
        is_available: 1,
        unavailable_from_date: null,
        unavailable_to_date: null
      }
    ];

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockResult);
    });

    const result = await userModel.getDoctorData(101);

    expect(db.query).toHaveBeenCalledWith(expect.any(String), 101, expect.any(Function));
    expect(result).toEqual(mockResult);
  });

  it('should throw an error when db query fails', async () => {
    const mockError = new Error('Query failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockError, null);
    });

    await expect(userModel.getDoctorData(101)).rejects.toThrow('Query failed');
    expect(db.query).toHaveBeenCalledWith(expect.any(String), 101, expect.any(Function));
  });
});


describe('getDeleteUserInfo', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return deleted user info when db query succeeds', async () => {
    const mockEmail = 'deleteduser@example.com';
    const mockResult = [
      {
        email: mockEmail,
        first_name: 'Jane',
        last_name: 'Doe',
        mobile_number: '9998887777'
      }
    ];

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockResult);
    });

    const result = await userModel.getDeleteUserInfo(mockEmail);

    expect(db.query).toHaveBeenCalledWith(expect.any(String), mockEmail, expect.any(Function));
    expect(result).toEqual(mockResult);
  });

  it('should throw an error when db query fails', async () => {
    const mockEmail = 'erroruser@example.com';
    const mockError = new Error('Database query failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockError, null);
    });

    await expect(userModel.getDeleteUserInfo(mockEmail)).rejects.toThrow('Database query failed');
    expect(db.query).toHaveBeenCalledWith(expect.any(String), mockEmail, expect.any(Function));
  });
});

describe('checkAlreadyExist', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when deleted user with email exists', async () => {
    const mockEmail = 'exists@example.com';
    const mockResult = [{ id: 1 }];

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockResult);
    });

    const result = await userModel.checkAlreadyExist(mockEmail);

    expect(db.query).toHaveBeenCalledWith(expect.any(String), mockEmail, expect.any(Function));
    expect(result).toBe(true);
  });

  it('should return false when deleted user with email does not exist', async () => {
    const mockEmail = 'notfound@example.com';
    const mockResult = [];

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockResult);
    });

    const result = await userModel.checkAlreadyExist(mockEmail);

    expect(db.query).toHaveBeenCalledWith(expect.any(String), mockEmail, expect.any(Function));
    expect(result).toBe(false);
  });

  it('should throw an error when db query fails', async () => {
    const mockEmail = 'error@example.com';
    const mockError = new Error('Query failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockError, null);
    });

    await expect(userModel.checkAlreadyExist(mockEmail)).rejects.toThrow('Query failed');
    expect(db.query).toHaveBeenCalledWith(expect.any(String), mockEmail, expect.any(Function));
  });
});

describe('createUserData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const input = {
    email: 'test@example.com',
    user_password: 'plainpassword',
    first_name: 'John',
    last_name: 'Doe',
    mobile_number: '1234567890'
  };

  it('should hash the password and insert user into database', async () => {
    const hashed = 'hashedpassword';
    const mockInsertResult = { insertId: 1 };

    bcrypt.hash.mockResolvedValue(hashed);

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockInsertResult);
    });

    const result = await userModel.createUserData(
      input.email,
      input.user_password,
      input.first_name,
      input.last_name,
      input.mobile_number
    );

    expect(bcrypt.hash).toHaveBeenCalledWith(input.user_password, 10);
    expect(db.query).toHaveBeenCalledWith(
      'insert into user_register set ?',
      {
        email: input.email,
        user_password: hashed,
        first_name: input.first_name,
        last_name: input.last_name,
        mobile_number: input.mobile_number
      },
      expect.any(Function)
    );
    expect(result).toEqual(mockInsertResult);
  });

  it('should throw error if bcrypt hashing fails', async () => {
    bcrypt.hash.mockRejectedValue(new Error('Hash error'));

    await expect(userModel.createUserData(
      input.email,
      input.user_password,
      input.first_name,
      input.last_name,
      input.mobile_number
    )).rejects.toThrow('Hash error');
  });

  it('should throw error if db query fails', async () => {
    const hashed = 'hashedpassword';
    const dbError = new Error('DB insert failed');

    bcrypt.hash.mockResolvedValue(hashed);
    db.query.mockImplementation((sql, values, callback) => {
      callback(dbError, null);
    });

    await expect(userModel.createUserData(
      input.email,
      input.user_password,
      input.first_name,
      input.last_name,
      input.mobile_number
    )).rejects.toThrow('DB insert failed');
  });
});

describe('checkUserDeleteOrNot', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when deleted user with email exists', async () => {
    const mockEmail = 'deleted@example.com';
    const mockResult = [{ id: 1 }];

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockResult);
    });

    const result = await userModel.checkUserDeleteOrNot(mockEmail);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT id FROM user_register WHERE is_deleted = true AND email = ?',
      [mockEmail],
      expect.any(Function)
    );
    expect(result).toBe(true);
  });

  it('should return false when no deleted user with email exists', async () => {
    const mockEmail = 'notfound@example.com';

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, []);
    });

    const result = await userModel.checkUserDeleteOrNot(mockEmail);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT id FROM user_register WHERE is_deleted = true AND email = ?',
      [mockEmail],
      expect.any(Function)
    );
    expect(result).toBe(false);
  });

  it('should throw an error when db query fails', async () => {
    const mockEmail = 'error@example.com';
    const dbError = new Error('Query failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(dbError, null);
    });

    await expect(userModel.checkUserDeleteOrNot(mockEmail)).rejects.toThrow('Query failed');

    expect(db.query).toHaveBeenCalledWith(
      'SELECT id FROM user_register WHERE is_deleted = true AND email = ?',
      [mockEmail],
      expect.any(Function)
    );
  });
});

describe('loginWithUsercode', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user data when user with userCode exists and is not deleted', async () => {
    const mockUserCode = 'U12345';
    const mockUser = {
      id: 1,
      email: 'user@example.com',
      userCode: mockUserCode,
      is_deleted: false
    };

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, [mockUser]);
    });

    const result = await userModel.loginWithUsercode(mockUserCode);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM user_register WHERE userCode = ? and is_deleted=false',
      [mockUserCode],
      expect.any(Function)
    );
    expect(result).toEqual(mockUser);
  });

  it('should return null when no user with userCode exists', async () => {
    const mockUserCode = 'U00000';

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, []);
    });

    const result = await userModel.loginWithUsercode(mockUserCode);

    expect(result).toBeNull();
  });

  it('should throw an error when db query fails', async () => {
    const mockUserCode = 'UERROR';
    const dbError = new Error('DB query failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(dbError, null);
    });

    await expect(userModel.loginWithUsercode(mockUserCode)).rejects.toThrow('DB query failed');
  });
});

describe('loginUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user data when email exists and is not deleted', async () => {
    const mockEmail = 'user@example.com';
    const mockUser = {
      id: 1,
      email: mockEmail,
      first_name: 'John',
      last_name: 'Doe',
      is_deleted: false
    };

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, [mockUser]);
    });

    const result = await userModel.loginUser(mockEmail);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM user_register WHERE email = ? and is_deleted=false',
      [mockEmail],
      expect.any(Function)
    );
    expect(result).toEqual(mockUser);
  });

  it('should return null when no matching email is found', async () => {
    const mockEmail = 'nonexistent@example.com';

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, []);
    });

    const result = await userModel.loginUser(mockEmail);

    expect(result).toBeNull();
  });

  it('should throw an error if database query fails', async () => {
    const mockEmail = 'error@example.com';
    const mockError = new Error('Database error');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockError, null);
    });

    await expect(userModel.loginUser(mockEmail)).rejects.toThrow('Database error');
  });
});

describe('updateUserData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockId = 1;
  const mockFormData = {
    first_name: 'Jane',
    last_name: 'Doe',
    mobile_number: '9876543210'
  };

  it('should update user data and return result', async () => {
    const mockDbResult = { affectedRows: 1 };

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockDbResult);
    });

    const result = await userModel.updateUserData(mockFormData, mockId);

    expect(db.query).toHaveBeenCalledWith(
      'UPDATE user_register set first_name=?, last_name=?, mobile_number=? WHERE id = ?',
      [
        mockFormData.first_name,
        mockFormData.last_name,
        mockFormData.mobile_number,
        mockId
      ],
      expect.any(Function)
    );
    expect(result).toEqual(mockDbResult);
  });

  it('should throw an error if db query fails', async () => {
    const mockError = new Error('DB error');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockError, null);
    });

    await expect(userModel.updateUserData(mockFormData, mockId)).rejects.toThrow('DB error');
  });
});


describe('updatePassword', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockEmail = 'test@example.com';
  const mockNewPassword = 'newPassword123';
  const mockHashedPassword = 'hashedPassword123';

  it('should hash password and update it in the database', async () => {
    const mockDbResult = { affectedRows: 1 };

    bcrypt.hash.mockResolvedValue(mockHashedPassword);
    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockDbResult);
    });

    const result = await userModel.updatePassword(mockEmail, mockNewPassword);

    expect(bcrypt.hash).toHaveBeenCalledWith(mockNewPassword, 10);
    expect(db.query).toHaveBeenCalledWith(
      'UPDATE user_Register SET user_password = ? WHERE email = ?',
      [mockHashedPassword, mockEmail],
      expect.any(Function)
    );
    expect(result).toEqual(mockDbResult);
  });

  it('should throw an error if bcrypt.hash fails', async () => {
    const hashError = new Error('Hashing failed');

    bcrypt.hash.mockRejectedValue(hashError);

    await expect(userModel.updatePassword(mockEmail, mockNewPassword)).rejects.toThrow('Hashing failed');
  });

  it('should throw an error if db.query fails', async () => {
    const dbError = new Error('DB update failed');

    bcrypt.hash.mockResolvedValue(mockHashedPassword);
    db.query.mockImplementation((sql, values, callback) => {
      callback(dbError, null);
    });

    await expect(userModel.updatePassword(mockEmail, mockNewPassword)).rejects.toThrow('DB update failed');
  });
});


describe('updateUserPassword', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockId = 1;
  const mockNewPassword = 'newSecurePassword123';

  it('should update user password successfully', async () => {
    const mockDbResult = { affectedRows: 1 };

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockDbResult);
    });

    const result = await userModel.updateUserPassword(mockNewPassword, mockId);

    expect(db.query).toHaveBeenCalledWith(
      'UPDATE user_Register SET user_password = ? WHERE id = ?',
      [mockNewPassword, mockId],
      expect.any(Function)
    );
    expect(result).toEqual(mockDbResult);
  });

  it('should throw an error if db.query fails', async () => {
    const mockDbError = new Error('DB query failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockDbError, null);
    });

    await expect(userModel.updateUserPassword(mockNewPassword, mockId)).rejects.toThrow('DB query failed');
  });
});

describe('deleteUserData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUserId = 1;

  it('should mark user as deleted successfully', async () => {
    const mockDbResult = { affectedRows: 1 };

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockDbResult);
    });

    const result = await userModel.deleteUserData(mockUserId);

    expect(db.query).toHaveBeenCalledWith(
      'UPDATE user_register SET is_deleted = TRUE WHERE id = ?',
      [mockUserId],
      expect.any(Function)
    );
    expect(result).toEqual(mockDbResult);
  });

  it('should throw an error if db.query fails', async () => {
    const mockDbError = new Error('DB query failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockDbError, null);
    });

    await expect(userModel.deleteUserData(mockUserId)).rejects.toThrow('DB query failed');
  });
});

describe('checkIfUserExists', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockEmail = 'user@example.com';

  it('should return true if user exists and is not deleted', async () => {
    const mockDbResult = [{ id: 1 }]; 

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockDbResult);
    });

    const result = await userModel.checkIfUserExists(mockEmail);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT id FROM user_register WHERE is_deleted=false and email= ?',
      [mockEmail],
      expect.any(Function)
    );
    expect(result).toBe(true);
  });

  it('should return false if user does not exist', async () => {
    const mockDbResult = []; 

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockDbResult);
    });

    const result = await userModel.checkIfUserExists(mockEmail);

    expect(result).toBe(false);
  });

  it('should throw an error if db.query fails', async () => {
    const mockDbError = new Error('DB query failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockDbError, null);
    });

    await expect(userModel.checkIfUserExists(mockEmail)).rejects.toThrow('DB query failed');
  });
});

describe('displayAdmin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return list of admin users', async () => {
    const mockDbResult = [
      { email: 'admin1@example.com' },
      { email: 'admin2@example.com' }
    ];

    db.query.mockImplementation((sql, callback) => {
      callback(null, mockDbResult);
    });

    const result = await userModel.displayAdmin();

    expect(db.query).toHaveBeenCalledWith(
      'SELECT email FROM user_register WHERE is_admin = true AND is_deleted = false',
      expect.any(Function)
    );
    expect(result).toEqual(mockDbResult);
  });

  it('should return empty array if no admins are found', async () => {
    const mockDbResult = [];

    db.query.mockImplementation((sql, callback) => {
      callback(null, mockDbResult);
    });

    const result = await userModel.displayAdmin();

    expect(result).toEqual(mockDbResult);
  });

  it('should throw an error if db.query fails', async () => {
    const mockDbError = new Error('DB query failed');

    db.query.mockImplementation((sql, callback) => {
      callback(mockDbError, null);
    });

    await expect(userModel.displayAdmin()).rejects.toThrow('DB query failed');
  });
});

describe('checkAdminCount', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the count of admin users', async () => {
    const mockDbResult = [{ adminCount: 5 }];

    db.query.mockImplementation((sql, callback) => {
      callback(null, mockDbResult);
    });

    const result = await userModel.checkAdminCount();

    expect(db.query).toHaveBeenCalledWith(
      'SELECT COUNT(*) AS adminCount FROM user_register WHERE is_admin = TRUE',
      expect.any(Function)
    );
    expect(result).toBe(5);
  });

  it('should return 0 if there are no admin users', async () => {
    const mockDbResult = [{ adminCount: 0 }];

    db.query.mockImplementation((sql, callback) => {
      callback(null, mockDbResult);
    });

    const result = await userModel.checkAdminCount();

    expect(result).toBe(0);
  });

  it('should throw an error if db.query fails', async () => {
    const mockDbError = new Error('DB query failed');

    db.query.mockImplementation((sql, callback) => {
      callback(mockDbError, null);
    });

    await expect(userModel.checkAdminCount()).rejects.toThrow('DB query failed');
  });
});


describe('checkEmailExists', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockEmail = 'user@example.com';

  it('should return true if email exists and user is not deleted', async () => {
    const mockDbResult = [{ id: 1 }]; 

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockDbResult);
    });

    const result = await userModel.checkEmailExists(mockEmail);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT id FROM user_register WHERE is_deleted= false and email = ?',
      [mockEmail],
      expect.any(Function)
    );
    expect(result).toBe(true);
  });

  it('should return false if email does not exist', async () => {
    const mockDbResult = []; 

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockDbResult);
    });

    const result = await userModel.checkEmailExists(mockEmail);

    expect(result).toBe(false);
  });

  it('should throw an error if db.query fails', async () => {
    const mockDbError = new Error('DB query failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockDbError, null);
    });

    await expect(userModel.checkEmailExists(mockEmail)).rejects.toThrow('DB query failed');
  });
});

describe('getName', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockEmail = 'user@example.com';

  it('should return first name if user exists and is not deleted', async () => {
    const mockDbResult = [{ first_name: 'John' }]; 

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockDbResult);
    });

    const result = await userModel.getName(mockEmail);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT first_name FROM user_register WHERE is_deleted = false AND email = ?',
      [mockEmail],
      expect.any(Function)
    );
    expect(result).toBe('John');
  });

  it('should throw "User not found" error if user does not exist', async () => {
    const mockDbResult = []; 

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockDbResult);
    });

    await expect(userModel.getName(mockEmail)).rejects.toThrow('User not found');
  });

  it('should throw an error if db.query fails', async () => {
    const mockDbError = new Error('DB query failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockDbError, null);
    });

    await expect(userModel.getName(mockEmail)).rejects.toThrow('DB query failed');
  });
});

describe('getDoctorInfo', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of doctor information', async () => {
    const mockDbResult = [
      {
        doctor_id: 1,
        name: 'Dr. Smith',
        specialization: 'Cardiology',
        doctorInTime: '09:00 AM',
        doctorOutTime: '05:00 PM',
        is_available: true,
        unavailable_from_date: null,
        unavailable_to_date: null
      },
      {
        doctor_id: 2,
        name: 'Dr. Johnson',
        specialization: 'Neurology',
        doctorInTime: '10:00 AM',
        doctorOutTime: '06:00 PM',
        is_available: true,
        unavailable_from_date: '2025-05-01',
        unavailable_to_date: '2025-05-10'
      }
    ];

    db.query.mockImplementation((sql, callback) => {
      callback(null, mockDbResult);
    });

    const result = await userModel.getDoctorInfo();

    expect(db.query).toHaveBeenCalledWith(
      'SELECT doctor_id, name, specialization, doctorInTime, doctorOutTime, is_available, unavailable_from_date, unavailable_to_date from doctors where is_deleted=false',
      expect.any(Function)
    );
    expect(result).toEqual(mockDbResult);
  });

  it('should return an empty array if no doctors are found', async () => {
    const mockDbResult = [];

    db.query.mockImplementation((sql, callback) => {
      callback(null, mockDbResult);
    });

    const result = await userModel.getDoctorInfo();

    expect(result).toEqual(mockDbResult);
  });

  it('should throw an error if db.query fails', async () => {
    const mockDbError = new Error('DB query failed');

    db.query.mockImplementation((sql, callback) => {
      callback(mockDbError, null);
    });

    await expect(userModel.getDoctorInfo()).rejects.toThrow('DB query failed');
  });
});

describe('isDoctorAvailable', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const doctor_id = 1;
  const patient_id = 101;
  const date = '2025-05-10';

  it('should return true if doctor is available (no appointment with this patient on the given date)', async () => {
    const mockDbResult = [{ count: 0 }];

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockDbResult);
    });

    const result = await userModel.isDoctorAvailable(doctor_id, date, patient_id);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT COUNT(*) AS count FROM appointments WHERE doctor_id = ? AND DATE(appointment_date) = ? AND patient_id = ? and status in(\'Scheduled\',\'Pending\')',
      [doctor_id, date, patient_id],
      expect.any(Function)
    );
    expect(result).toBe(true); 
  });

  it('should return false if doctor is not available (appointment already exists for this patient on the given date)', async () => {
    const mockDbResult = [{ count: 1 }]; 

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockDbResult);
    });

    const result = await userModel.isDoctorAvailable(doctor_id, date, patient_id);

    expect(result).toBe(false); 
  });

  it('should throw an error if db.query fails', async () => {
    const mockDbError = new Error('DB query failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockDbError, null);
    });

    await expect(userModel.isDoctorAvailable(doctor_id, date, patient_id)).rejects.toThrow('DB query failed');
  });
});

describe('createDoctorAppointment', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const patient_id = 101;
  const doctor_id = 1;
  const date = '2025-05-10';
  const time = '10:00 AM';
  const disease_type = 'Flu';
  const disease_description = 'Seasonal flu symptoms';

  it('should successfully create an appointment and disease entry', async () => {
    const mockAppointmentResult = { insertId: 1001 };
    const mockDiseaseResult = { insertId: 2001 };

    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(null, mockAppointmentResult); 
    });

    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(null, mockDiseaseResult); 
    });

    const result = await userModel.createDoctorAppointment(
      patient_id,
      doctor_id,
      date,
      time,
      disease_type,
      disease_description
    );

    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO appointments (appointment_date, appointment_time, patient_id, doctor_id) VALUES (?, ?, ?, ?)',
      [date, time, patient_id, doctor_id],
      expect.any(Function)
    );
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO disease (disease_type, disease_description, patient_id, appointment_id) VALUES (?, ?, ?, ?)',
      [disease_type, disease_description, patient_id, mockAppointmentResult.insertId],
      expect.any(Function)
    );
    expect(result).toEqual(mockDiseaseResult);
  });

  it('should reject if appointment insertion fails', async () => {
    const mockError = new Error('Failed to insert appointment');

    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(mockError, null); 
    });

    await expect(userModel.createDoctorAppointment(
      patient_id,
      doctor_id,
      date,
      time,
      disease_type,
      disease_description
    )).rejects.toThrow('Failed to insert appointment');
  });

  it('should reject if disease insertion fails after appointment insertion', async () => {
    const mockAppointmentResult = { insertId: 1001 };
    const mockError = new Error('Failed to insert disease');

    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(null, mockAppointmentResult); 
    });

    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(mockError, null); 
    });

    await expect(userModel.createDoctorAppointment(
      patient_id,
      doctor_id,
      date,
      time,
      disease_type,
      disease_description
    )).rejects.toThrow('Failed to insert disease');
  });

  it('should throw an error if there is an unexpected failure in the try-catch block', async () => {
    const mockError = new Error('Unexpected error');

    db.query.mockImplementationOnce(() => {
      throw mockError; 
    });

    await expect(userModel.createDoctorAppointment(
      patient_id,
      doctor_id,
      date,
      time,
      disease_type,
      disease_description
    )).rejects.toThrow('Unexpected error');
  });
});

describe('doctorFlag', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const email = 'doctor@example.com';

  it('should successfully update the is_doctor flag to true', async () => {
    const mockResult = { affectedRows: 1 }; 

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockResult); 
    });

    const result = await userModel.doctorFlag(email);

    expect(db.query).toHaveBeenCalledWith(
      'UPDATE user_register set is_doctor = true WHERE email = ?',
      [email],
      expect.any(Function)
    );
    expect(result).toEqual(mockResult);
  });

  it('should reject if the query fails', async () => {
    const mockError = new Error('Database query failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockError, null); 
    });

    await expect(userModel.doctorFlag(email)).rejects.toThrow('Database query failed');
  });

  it('should throw an error if there is an unexpected failure in the try-catch block', async () => {
    const mockError = new Error('Unexpected error');

    db.query.mockImplementation(() => {
      throw mockError; 
    });

    await expect(userModel.doctorFlag(email)).rejects.toThrow('Unexpected error');
  });
});

describe('checkDoctor', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const email = 'doctor@example.com';

  it('should return true if doctor exists', async () => {
    const mockResult = [{ email: 'doctor@example.com' }]; 

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockResult); 
    });

    const result = await userModel.checkDoctor(email);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT email FROM doctors WHERE email = ?',
      [email],
      expect.any(Function)
    );
    expect(result).toBe(true); 
  });

  it('should return false if doctor does not exist', async () => {
    const mockResult = []; 

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockResult); 
    });

    const result = await userModel.checkDoctor(email);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT email FROM doctors WHERE email = ?',
      [email],
      expect.any(Function)
    );
    expect(result).toBe(false); 
  });

  it('should reject if the query fails', async () => {
    const mockError = new Error('Database query failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockError, null); 
    });

    await expect(userModel.checkDoctor(email)).rejects.toThrow('Database query failed');
  });

  it('should throw an error if there is an unexpected failure in the try-catch block', async () => {
    const mockError = new Error('Unexpected error');

    db.query.mockImplementation(() => {
      throw mockError; 
    });

    await expect(userModel.checkDoctor(email)).rejects.toThrow('Unexpected error');
  });
});

describe('checkDoctorAvailability', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const doctor_id = 1;
  const date = '2025-05-15';

  it('should return doctor availability and appointments if available', async () => {
    const mockResult = [
      {
        doctorInTime: '09:00',
        doctorOutTime: '17:00',
        appointment_date: '2025-05-15',
        appointment_time: '10:00',
        status: 'Scheduled',
        is_available: true,
        unavailable_from_date: null,
        unavailable_to_date: null,
        patient_id: 123,
        patient_name: 'John Doe',
        date_of_birth: '1980-01-01',
        gender: 'Male',
        age: 45,
        weight: 75,
        height: 175,
        bmi: 24.5,
        country_of_origin: 'USA',
        is_diabetic: false,
        cardiac_issue: false,
        blood_pressure: '120/80'
      }
    ];

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockResult); 
    });

    const result = await userModel.checkDoctorAvailability(doctor_id, date);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT'),
      [date, doctor_id, doctor_id, date],
      expect.any(Function)
    );
    expect(result).toEqual(mockResult); 
  });

  it('should return an empty array if no appointments or doctor data are found', async () => {
    const mockResult = [];

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockResult); 
    });

    const result = await userModel.checkDoctorAvailability(doctor_id, date);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT'),
      [date, doctor_id, doctor_id, date],
      expect.any(Function)
    );
    expect(result).toEqual(mockResult); 
  });

  it('should reject if the query fails', async () => {
    const mockError = new Error('Database query failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockError, null); 
    });

    await expect(userModel.checkDoctorAvailability(doctor_id, date)).rejects.toThrow('Database query failed');
  });
});

describe('getSearchedDoctor', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const keyword = 'John';

  it('should return searched doctor details if doctors are found', async () => {
    const mockResult = [
      {
        doctor_id: 1,
        name: 'Dr. John Doe',
        specialization: 'Cardiology',
        doctorInTime: '09:00',
        doctorOutTime: '17:00',
        is_available: true,
        unavailable_from_date: null,
        unavailable_to_date: null
      }
    ];

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockResult); 
    });

    const result = await userModel.getSearchedDoctor(keyword);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT doctor_id,name, specialization, doctorInTime, doctorOutTime,is_available,unavailable_from_date,unavailable_to_date FROM doctors WHERE is_deleted = false AND (name LIKE ? OR specialization LIKE ?)',
      ['%John%', '%John%'],
      expect.any(Function)
    );
    expect(result).toEqual(mockResult); 
  });

  it('should return an empty array if no doctors are found', async () => {
    const mockResult = [];

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockResult); 
    });

    const result = await userModel.getSearchedDoctor(keyword);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT doctor_id,name, specialization, doctorInTime, doctorOutTime,is_available,unavailable_from_date,unavailable_to_date FROM doctors WHERE is_deleted = false AND (name LIKE ? OR specialization LIKE ?)',
      ['%John%', '%John%'],
      expect.any(Function)
    );
    expect(result).toEqual(mockResult); 
  });

  it('should reject if the query fails', async () => {
    const mockError = new Error('Database query failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockError, null); 
    });

    await expect(userModel.getSearchedDoctor(keyword)).rejects.toThrow('Database query failed');
  });
});

describe('setIsDoctor', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const email = 'test@example.com';

  it('should resolve when the user is set as doctor successfully', async () => {
    const mockResult = { affectedRows: 1 };

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockResult); 
    });

    const result = await userModel.setIsDoctor(email);

    expect(db.query).toHaveBeenCalledWith(
      'update user_register set is_doctor=true where email=?',
      email,
      expect.any(Function)
    );
    expect(result).toEqual(mockResult); 
  });

  it('should reject if the query fails', async () => {
    const mockError = new Error('Database query failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockError, null); 
    });

    await expect(userModel.setIsDoctor(email)).rejects.toThrow('Database query failed');
  });
});

describe('addAsAdmin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const email = 'admin@example.com';

  it('should resolve when the user is set as admin successfully', async () => {
    const mockResult = { affectedRows: 1 };

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockResult);
    });

    const result = await userModel.addAsAdmin(email);

    expect(db.query).toHaveBeenCalledWith(
      'update user_register set is_admin=true where email=?',
      email,
      expect.any(Function)
    );
    expect(result).toEqual(mockResult); 
  });

  it('should reject if the query fails', async () => {
    const mockError = new Error('Database query failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockError, null); 
    });

    await expect(userModel.addAsAdmin(email)).rejects.toThrow('Database query failed');
  });
});

describe('getAppointmentHistory', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const patient_id = 1;

  it('should resolve with appointment history when the query is successful', async () => {
    const mockResult = [
      {
        appointment_id: 1,
        patient_name: 'John Doe',
        doctorName: 'Dr. Smith',
        status: 'Completed',
        appointment_date: '2025-05-01',
        appointment_time: '10:00 AM',
        disease_type: 'Fever',
        disease_description: 'High fever and chills',
      }
    ];

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockResult);
    });

    const result = await userModel.getAppointmentHistory(patient_id);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT DISTINCT'),
      patient_id,
      expect.any(Function)
    );
    expect(result).toEqual(mockResult); 
  });

  it('should reject if the query fails', async () => {
    const mockError = new Error('Database query failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockError, null); 
    });

    await expect(userModel.getAppointmentHistory(patient_id)).rejects.toThrow('Database query failed');
  });
});

describe('updateDoctorAppointment', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const doctor_id = 2;
  const date = '2025-05-01';
  const time = '11:00 AM';
  const disease_type = 'Cold';
  const disease_description = 'Mild cold and cough';
  const appointment_id = 3;

  it('should resolve when the appointment is updated successfully', async () => {
    const mockAppointmentResult = { affectedRows: 1 };

    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(null, mockAppointmentResult); 
    });

    const updateDisease = jest.fn().mockResolvedValue(true);

    const result = await userModel.updateDoctorAppointment(
      doctor_id, date, time, disease_type, disease_description, appointment_id
    );

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE appointments'),
      [date, time, doctor_id, appointment_id],
      expect.any(Function)
    );
    expect(updateDisease).toHaveBeenCalledWith(disease_type, disease_description, appointment_id);
    expect(result).toEqual(mockAppointmentResult); 
  });

  it('should reject if the appointment update query fails', async () => {
    const mockError = new Error('Appointment update failed');

    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(mockError, null); 
    });

    await expect(
      userModel.updateDoctorAppointment(doctor_id, date, time, disease_type, disease_description, appointment_id)
    ).rejects.toThrow('Appointment update failed');
  });

  it('should reject if the disease update query fails', async () => {
    const mockAppointmentResult = { affectedRows: 1 };

    db.query.mockImplementationOnce((sql, values, callback) => {
      callback(null, mockAppointmentResult);
    });

    const updateDisease = jest.fn().mockRejectedValue(new Error('Disease update failed'));

    await expect(
      userModel.updateDoctorAppointment(doctor_id, date, time, disease_type, disease_description, appointment_id)
    ).rejects.toThrow('Disease update failed');
  });
});

describe('updateDisease', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const disease_type = 'Flu';
  const disease_description = 'Fever, body ache';
  const appointment_id = 1;

  it('should resolve when disease is updated successfully', async () => {
    const mockResult = { affectedRows: 1 }; 

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockResult); 
    });


    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE disease'),
      [disease_type, disease_description, appointment_id],
      expect.any(Function)
    );
    expect(result).toEqual(mockResult); 
  });

  it('should reject if the disease update query fails', async () => {
    const mockError = new Error('Disease update failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockError, null); 
    });

  });
});

describe('getAppointmentInfo', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const appointment_id = 1;

  it('should resolve with appointment info when the query is successful', async () => {
    const mockResult = [
      {
        appointment_id: 1,
        status: 'Scheduled',
        appointment_date: '2025-05-01',
        appointment_time: '10:00 AM',
        disease_types: 'Flu',
        disease_description: 'Fever, body ache',
        doctor_id: 2,
        name: 'Dr. Smith'
      }
    ];

    db.query.mockImplementation((sql, values, callback) => {
      callback(null, mockResult);
    });

    const result = await getAppointmentInfo(appointment_id);

   
  });

  it('should reject if the query fails', async () => {
    const mockError = new Error('Database query failed');

    db.query.mockImplementation((sql, values, callback) => {
      callback(mockError, null); 
    });

    await expect(getAppointmentInfo(appointment_id)).rejects.toThrow('Database query failed');
  });
});
});
