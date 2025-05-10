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

//   jest.mock('../db'); // Replace with the actual relative path
// const db = require('../db');

// const {
//   getDoctorData,
//   getDeleteUserInfo
// } = require('../path-to-your-model'); // Replace with the actual path

// describe('Doctor/User Model Functions', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test('getDoctorData should return doctor info by user ID', async () => {
//     const mockData = [{
//       email: 'doc@example.com',
//       first_name: 'John',
//       last_name: 'Doe',
//       mobile_number: '1234567890',
//       doctorInTime: '09:00',
//       doctorOutTime: '17:00',
//       is_available: true,
//       unavailable_from_date: null,
//       unavailable_to_date: null
//     }];

//     db.query.mockImplementation((query, param, callback) => {
//       callback(null, mockData);
//     });

//     const result = await userModel.getDoctorData(1);
//     expect(result).toEqual(mockData);
//     expect(db.query).toHaveBeenCalledWith(expect.any(String), 1, expect.any(Function));
//   });

//   test('getDoctorData should throw error on DB failure', async () => {
//     db.query.mockImplementation((query, param, callback) => {
//       callback(new Error('Database error'), null);
//     });

//     await expect(userModel.getDoctorData(1)).rejects.toThrow('Database error');
//   });

//   test('getDeleteUserInfo should return deleted user info by email', async () => {
//     const mockUser = [{
//       email: 'deleted@example.com',
//       first_name: 'Jane',
//       last_name: 'Smith',
//       mobile_number: '9876543210'
//     }];

//     db.query.mockImplementation((query, param, callback) => {
//       callback(null, mockUser);
//     });

//     const result = await userModel.getDeleteUserInfo('deleted@example.com');
//     expect(result).toEqual(mockUser);
//     expect(db.query).toHaveBeenCalledWith(expect.any(String), 'deleted@example.com', expect.any(Function));
//   });

//   test('getDeleteUserInfo should throw error on DB failure', async () => {
//     db.query.mockImplementation((query, param, callback) => {
//       callback(new Error('DB failure'), null);
//     });

//     await expect(userModel.getDeleteUserInfo('x@example.com')).rejects.toThrow('DB failure');
//   });
// });


//   describe('checkAlreadyExist', () => {
//     it('Success: should resolve to true if user exists', async () => {
//       db.query.mockImplementation((sql, params, callback) => callback(null, [{}]));

//       const result = await userModel.checkAlreadyExist(testConstants.checkAlreadyExistReq);
//       expect(result).toBe(true);
//     });

//     it('Failure: should resolve to false if user does not exist', async () => {
//       db.query.mockImplementation((sql, params, callback) => callback(null, []));

//       const result = await userModel.checkAlreadyExist(testConstants.checkAlreadyExistReq);
//       expect(result).toBe(false);
//     });

//     it('Failure: should reject on DB error', async () => {
//       db.query.mockImplementation((sql, params, callback) => callback(new Error('DB error')));
//       await expect(userModel.checkAlreadyExist(testConstants.checkAlreadyExistReq)).rejects.toThrow('DB error');
//     });
//   });

//   describe('createUserData', () => {
//     it('Success: should create user and hash password', async () => {
//       bcrypt.hash.mockResolvedValue('hashed_password');
//       db.query.mockImplementation((sql, data, callback) => callback(null, { insertId: 1 }));

//       const result = await userModel.createUserData(
//        testConstants.createUserData
//       );

//       expect(result).toEqual({ insertId: 1 });
//     });

//     it('Failure: should throw error on query failure', async () => {
//       db.query.mockImplementation((sql, data, callback) => callback(new Error('Insert error')));

//       await expect(userModel.createUserData(
//        testConstants.createUserData
//       )).rejects.toThrow('Insert error');
//     });
//   });

//   describe('loginUser', () => {
//     it('Success: should return user data if email exists', async () => {
//       const user = testConstants.loginUser;
//       db.query.mockImplementation((sql, params, callback) => callback(null, [user]));

//       const result = await userModel.loginUser(testConstants.loginUser.email);
//       expect(result).toEqual(user);
//     });

//     it('Failure: should return null if user not found', async () => {
//       db.query.mockImplementation((sql, params, callback) => callback(null, []));

//       const result = await userModel.loginUser(testConstants.loginUser.email);
//       expect(result).toBeNull();
//     });
//   });

//   describe('deleteUserData', () => {
//     it('Success: should update is_deleted to true', async () => {
//       const mockResult = { affectedRows: 1 };
//       db.query.mockImplementation((sql, id, callback) => callback(null, mockResult));

//       const result = await userModel.deleteUserData(5);
//       expect(result).toEqual(mockResult);
//     });
//   });

//   describe('checkDoctorAvailability', () => {
//     it('Success: should return doctor availability info', async () => {
//       const mockAvailability =testConstants.checkDoctorAvailability;
//       db.query.mockImplementation((sql, params, callback) => callback(null, mockAvailability));

//       const result = await userModel.checkDoctorAvailability(testConstants.checkDoctorAvailabilityReq);
//       expect(result).toEqual(mockAvailability);
//     });
//   });

// describe('updateUserPassword', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test('should update user password successfully', async () => {
//     const mockResult = { affectedRows: 1 };

//     db.query.mockImplementation((query, params, callback) => {
//       callback(null, mockResult);
//     });

//     const result = await userModel.updateUserPassword('newPass123', 10);
//     expect(result).toEqual(mockResult);
//     expect(db.query).toHaveBeenCalledWith(
//       expect.stringContaining('UPDATE user_Register'),
//       ['newPass123', 10],
//       expect.any(Function)
//     );
//   });

//   test('should throw error when db query fails', async () => {
//     db.query.mockImplementation((query, params, callback) => {
//       callback(new Error('DB Error'), null);
//     });

//     await expect(userModel.updateUserPassword('failPass', 99)).rejects.toThrow('DB Error');
//   });
// });




// describe('User Model Functions', () => {
//   test('getDeleteUserInfo should return user info if user is deleted', async () => {
//     db.query.mockImplementation((query, email, callback) => {
//       callback(null, [{ email, first_name: 'John', last_name: 'Doe', mobile_number: '1234567890' }]);
//     });

//     const result = await userModel.getDeleteUserInfo('test@example.com');
//     expect(result).toEqual([{ email: 'test@example.com', first_name: 'John', last_name: 'Doe', mobile_number: '1234567890' }]);
//   });

//   test('checkAlreadyExist should return true if user exists', async () => {
//     db.query.mockImplementation((query, email, callback) => {
//       callback(null, [{ id: 1 }]);
//     });

//     const result = await userModel.checkAlreadyExist('test@example.com');
//     expect(result).toBe(true);
//   });

//   test('createUserData should insert user into database', async () => {
//     db.query.mockImplementation((query, values, callback) => {
//       callback(null, { insertId: 1 });
//     });

//     const result = await userModel.createUserData('test@example.com', 'password123', 'John', 'Doe', '1234567890');
//     expect(result).toEqual({ insertId: 1 });
//   });

//   test('checkUserDeleteOrNot should return true if user is deleted', async () => {
//     db.query.mockImplementation((query, values, callback) => {
//       callback(null, [{ id: 1 }]);
//     });

//     const result = await userModel.checkUserDeleteOrNot('test@example.com');
//     expect(result).toBe(true);
//   });

//   test('loginUser should return user data if credentials match', async () => {
//     db.query.mockImplementation((query, values, callback) => {
//       callback(null, [{ id: 1, email: 'test@example.com', first_name: 'John' }]);
//     });

//     const result = await userModel.loginUser('test@example.com');
//     expect(result).toEqual({ id: 1, email: 'test@example.com', first_name: 'John' });
//   });

//   test('updateUserData should update user details', async () => {
//     db.query.mockImplementation((query, values, callback) => {
//       callback(null, { affectedRows: 1 });
//     });

//     const result = await userModel.updateUserData({ first_name: 'John', last_name: 'Doe', mobile_number: '1234567890' }, 1);
//     expect(result).toEqual({ affectedRows: 1 });
//   });

//   test('updatePassword should update user password', async () => {
//     db.query.mockImplementation((query, values, callback) => {
//       callback(null, { affectedRows: 1 });
//     });

//     const result = await userModel.updatePassword('test@example.com', 'newpassword123');
//     expect(result).toEqual({ affectedRows: 1 });
//   });

//   test('deleteUserData should mark user as deleted', async () => {
//     db.query.mockImplementation((query, values, callback) => {
//       callback(null, { affectedRows: 1 });
//     });

//     const result = await userModel.deleteUserData(1);
//     expect(result).toEqual({ affectedRows: 1 });
//   });

//   test('checkIfUserExists should return true if user exists', async () => {
//     db.query.mockImplementation((query, values, callback) => {
//       callback(null, [{ id: 1 }]);
//     });

//     const result = await userModel.checkIfUserExists('test@example.com');
//     expect(result).toBe(true);
//   });

//   test('displayAdmin should return list of admins', async () => {
//     db.query.mockImplementation((query, callback) => {
//       callback(null, [{ email: 'admin@example.com' }]);
//     });

//     const result = await userModel.displayAdmin();
//     expect(result).toEqual([{ email: 'admin@example.com' }]);
//   });

//   test('getDoctorInfo should return list of doctors', async () => {
//     db.query.mockImplementation((query, callback) => {
//       callback(null, [{ doctor_id: 1, name: 'Dr. Smith', specialization: 'Cardiology' }]);
//     });

//     const result = await userModel.getDoctorInfo();
//     expect(result).toEqual([{ doctor_id: 1, name: 'Dr. Smith', specialization: 'Cardiology' }]);
//   });

//   test('isDoctorAvailable should return true if doctor is available', async () => {
//     db.query.mockImplementation((query, values, callback) => {
//       callback(null, [{ count: 0 }]);
//     });

//     const result = await userModel.isDoctorAvailable(1, '2025-05-10', 1);
//     expect(result).toBe(true);
//   });

//   test('doctorFlag should update doctor status', async () => {
//     db.query.mockImplementation((query, values, callback) => {
//       callback(null, { affectedRows: 1 });
//     });

//     const result = await userModel.doctorFlag('test@example.com');
//     expect(result).toEqual({ affectedRows: 1 });
//   });

//   test('checkDoctor should return true if doctor exists', async () => {
//     db.query.mockImplementation((query, values, callback) => {
//       callback(null, [{ email: 'doctor@example.com' }]);
//     });

//     const result = await userModel.checkDoctor('doctor@example.com');
//     expect(result).toBe(true);
//   });
// });



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
});
