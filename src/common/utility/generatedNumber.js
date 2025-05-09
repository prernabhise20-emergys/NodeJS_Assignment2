const generateDoctorCode = async () => {
    const randomNumber = Math.floor(100 + Math.random() * 900);
    const newCode = `DR${randomNumber}`;
  
    return newCode;
  };
  const generatePassword = async (first_name) => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const newCode = `${first_name}@${randomNumber}`;
  
    return newCode;
  };

  export default {generateDoctorCode,generatePassword}