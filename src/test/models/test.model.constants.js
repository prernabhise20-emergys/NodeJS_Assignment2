const getUserData={ email: 'prerna@gmail.com', first_name: 'Prerna', last_name: 'Bhise', mobile_number: '1234567890' }


const checkAlreadyExistReq={
    email:'prerna@gmail.com'
}

const createUserData={
    email:'prerna@gmail.com',
    plain_password:'wasdsx',
    first_name:'Prerna',
    last_name:'Bhise',
    mobile_number:'1234567898'
}

const loginUser={ email: 'prerna@gmail.com', user_password: 'hashed' }

const checkDoctorAvailability= [{ doctorInTime: '10:00', doctorOutTime: '17:00' }]

const checkDoctorAvailabilityReq={
    doctor_id:1,
date:'2025-05-01'
}

const updatePassword={
    email:'prerna@gmail.com',
    newPassword:'qwerty'
}

const getDoctorResult=[{ doctorName: 'Dr. Smith', specialization: 'Cardiology' }]

const updateDoctor={
    name:'dr.prerna',
    email:'prerna@gmail.com'
}

const showAppointments=[{ appointment_id: 1, patient_name: 'John Doe' }]

const savePrescription={
    p_id:'1',
    url:'http://url',
    date:'2024-01-01'
}

const getAppointmentData=[{
    patientName: 'xyz',
    date: '2024-01-01',
    doctorName: 'Dr. pqr'
  }]

  const getPrescription= [{ appointment_id: 1, file_url: 'url' }]

  const getInfo=[
    {
      patient_id: 1,
      patient_name: 'Satej',
      gender: 'Male',
      document_type: 'PDF',
      document_url: 'http://example.com/doc.pdf',
    }
  ]

  const getInfoResult=[
    {
      patient_id: 1,
      patient_name: 'Satej',
      gender: 'Male',
      documents: [
        { document_type: 'PDF', document_url: 'http://example.com/doc.pdf' }
      ],
    }
  ]

  const createDoctorData= {
    first_name: 'Prerna',
    last_name: 'Bhise',
    email: 'prerna@gmail.com',
    user_password: 'password',
    contact_number: '1234567890',
    doctorCode: 'DOC001',
    name: 'Dr. Prerna',
    specialization: 'Cardiology',
    doctorInTime: '10:00',
    doctorOutTime: '18:00'
  }

  const getPatientInfo=[
    {
      patient_id: 1,
      patient_name: "Prerna Bhise",
      first_name: "Prerna",
      last_name: "Bhise",
      gender: "female",
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
      father_name: "Sanjay",
      father_age: 60,
      mother_name: "Manjushri",
      mother_age: 58,
      father_country_origin: "USA",
      mother_country_origin: "USA",
      father_diabetic: false,
      father_cardiac_issue: false,
      father_bp: false,
      mother_diabetic: false,
      mother_cardiac_issue: false,
      mother_bp: false,
      disease_type: "Diabetes",
      disease_description: "Type 1",
      document_type: "Report",
      document_url: "http://example.com/report.pdf",
      appointment_status: "Scheduled",
      doctor_id: 2,
    },
  ]

  const getPatientInfoRes=[
    { document_type: "Report", document_url: "http://example.com/report.pdf" },
  ]

  const createPersonalDetails= {
    patient_name: "Suyash",
    date_of_birth: "1990-01-01",
    gender: "male",
    height: 5.5,
    weight: 60,
    is_diabetic: false,
    cardiac_issue: false,
    blood_pressure: "Normal",
    country_of_origin: "India",
  }

  const createPersonalDetailsReq={
    id:'1001',
    email: "prerna@gmail.com"
  }
export {getUserData,checkAlreadyExistReq,createPersonalDetails,createPersonalDetailsReq,createDoctorData,getPatientInfoRes,getPatientInfo,getAppointmentData,getInfoResult,getInfo,getPrescription,savePrescription,createUserData,showAppointments,updateDoctor,updatePassword,getDoctorResult,loginUser,checkDoctorAvailabilityReq,checkDoctorAvailability}