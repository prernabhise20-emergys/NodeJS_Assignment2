const registerApiBody={
    email: "prera@gmail.com",
    user_password: '123456',
    first_name: 'Prerna',
    last_name: 'Bhise',
    mobile_number: '1234567867',

}
const regitserId={
    id:1
}
const loginId={
    id:1
}
const loginApiBody={
    email: "prera@gmail.com",
    user_password: '123456',
   userCode:'DR123',

}
const updateUserBody={
    
        first_name: "John",
        last_name: "Bhise",
        mobile_number: "1234567890"
      
}
const updateUserId={
    userid:1
}
const deleteUserBody={
    
        userid: 1,
        admin: true
      
}
const getUserBody={
    
        userid: 1,
        email: "prerna@gmail.com"
      
}
const getUserResult={
     id: 1, 
     first_name: "John", 
     last_name: "Bhise", 
     email: "prerna@gmail.com" 
}

const forgotPasswordBody={
    email: "prerna@gmail.com"
  }

  const otpInformation={
     mockName : "Prerna ",
     mockOtp : "123456",
     mockHashOtp : "hashedOtp12345"
  }

  const resetPasswordBody={
    email: "prerna@gmail.com",
    newPassword: "newpassword123"
  }

  const changePasswordBody={
        userid: 1
      }

      const getDoctorResult={ 
        name: 'Dr. Prerna Bhise', 
        specialization: 'Cardiology'
     }

     const createAppointmentBody= {
        patient_id: 1,
        doctor_id: 1,
        date: '2025-04-30',
        time: '10:00 AM',
      }

      const getDoctorAvailabilityBody={
        doctor_id: 1,
        date: '2025-04-30' 
      }

      const getDoctorAvailabilityResult=[
        {
          doctorInTime: '9:00 AM',
          doctorOutTime: '5:00 PM',
          appointment_time: '2025-04-30T09:30:00',
          status: 'Scheduled',
        },
        {
          doctorInTime: '9:00 AM',
          doctorOutTime: '5:00 PM',
          appointment_time: '2025-04-30T10:30:00',
          status: 'Pending',
        },
        {
          doctorInTime: '9:00 AM',
          doctorOutTime: '5:00 PM',
          appointment_time: '2025-04-30T11:30:00',
          status: 'Scheduled',
        },
      ];

      const getDoctorAvailabilityResponse= {
        doctorInTime: '9:00 AM',
        doctorOutTime: '5:00 PM',
        scheduleSlots: ['2025-04-30T09:30:00', '2025-04-30T11:30:00'],
        pendingSlots: ['2025-04-30T10:30:00'],
      }

      const getDoctorAvailabilityNegativeResponse={
        doctorInTime: 'Not Available',
        doctorOutTime: 'Not Available',
        scheduleSlots: [],
        pendingSlots: [],
      }

      const searchDoctorBody= { 
        keyword: 'Cardiologist'
    }

    const searchDoctorResult=[
        { id: 1, name: 'Dr. Prerna Bhise', specialty: 'Cardiologist' },
        { id: 2, name: 'Dr. Satej Bhise', specialty: 'Cardiologist' },
      ]

      const getDoctorProfile={
        userid: 1, 
      }

      const getDoctorProfileResult={
        id: 1,
        firstName: 'prerna',
        lastName: 'bhise',
        speciality: 'Cardiology',
        email: 'doctor@example.com',
        phone: '1234567890',
      };

      const updateDoctorBody={
        name: 'Dr.Prerna Bhise',
        specialization: 'Cardiology',
        contact_number: '1234567890',
        doctorInTime: '09:00',
        doctorOutTime: '17:00',
      }

      const updateDoctorUser={
        doctor: true,
        email: 'drprerna@example.com',
      }

      const displayAppointmentsBody={
        doctor: false,
        admin: false,
        userid:1,
      }

      const displayAppointmentsResult=[
        { id: 1, 
          date: '2025-04-28',
           time: '11:00 AM' 
          }
        ]

        const getAllInfoRequest= {
          user: { admin: true },
          query: { page: '2', limit: '10' },
        }

        const getAllInfoPersonal=[
          { 
            id: 1, 
            name: 'John Doe'
           }
          ]

          const totalCount={
            count:50
          }

          const adminDeletePatientDataBody={
      user: { admin: true },
      query: { patient_id: '123' }
    }

    const ageGroupDataUser={
       admin: true 
      }

      const ageGroupDataSample= [
        { ageGroup: 'child', count: 10 },
        { ageGroup: 'teen', count: 15 },
        { ageGroup: 'adult', count: 20 },
        { ageGroup: 'older', count: 5 }
      ];

      const ageGroupDataResponse= {
        Child: 10,
        Teen: 15,
        Adults: 20,
        Older: 5
      }

      const ageGroupDataZeroResponse={
        Child: 0,
        Teen: 0,
        Adults: 0,
        Older: 0
      }

      const addAdminBody={
        email: 'prerna@example.com',
        user_password: 'securepassword',
        first_name: 'Prerna',
        last_name: 'Bhise',
        mobile_number: '1234567890',
      }

      const removeAdminReqBody={
        user: { admin: true },
        body: { email: 'prerna@example.com' },
      }

      const getAdminUser= {
        admin: false,
      }

      const getAdminParams={ email:'prerna@gmail.com' }

      const addDoctorUser={ admin: true }

      const addDoctorBody={
        specialization: 'Cardiology',
        contact_number: '1234567890',
        email: 'prerna@gmail.com',
        doctorInTime: '09:00',
        doctorOutTime: '17:00',
        user_password: 'password123',
        first_name: 'Prerna',
        last_name: 'Bhise',
      }

      const deleteDoctorQuery={
        doctor_id: '123',
      }

      const changeAppointmentsStatusReq={
        query: { status: 'Cancelled', appointment_id: '123' },
        user: { admin: true, email: 'admin@gmail.com' },
      }

      const getAppointmentInformation=[
        {
          patient_name: 'Prerna Bhise',
          appointment_date: '2025-04-29',
          appointment_time: '10:00 AM',
          name: 'Dr. Satej',
        },
      ]

      const appointmentCancelledBody={
        query: { appointment_id: '123' },
        user: { admin: true, email: 'admin@gmail.com' },
        body: { reason: 'Patient request' },
      }

      const appointmentCancelledResult={
        patient_name: 'Prerna Bhise',
        appointment_date: '2025-04-30',
        appointment_time: '10:00 AM',
        name: 'Dr. Satej',
        reason: 'Patient request',
      }

      const approveAppointmentReq= {
        query: { appointment_id: '123' },
        user: { admin: true, email: 'admin@gmail.com' },
      }

      const appointmentRequestUser={
        user: { admin: true },
      }

      const appointmentRequestResult= [
        { appointment_id: '123', patient_name: 'Prerna Bhise', appointment_date: '2025-04-29' },
      ]

      const getAllAppointmentReq={
        user: { admin: true, doctor: false },
        query: { doctor_id: '456' },
      }

      const getAllAppointmentResult= [
        { appointment_id: '123', patient_name: 'Prerna Bhise', appointment_date: '2025-04-29' },
      ];

      const getPatientsAppointmentReq={
        user: { admin: true, doctor: false },
      }

      const getPatientsAppointmentResponse=[
        { appointment_id: '123', patient_name: 'Prerna Bhise', appointment_date: '2025-04-29T00:00:00Z' },
      ]

      const getAllEmailReq={
        user: { admin: true, doctor: false },
      }

      const getAllEmailRes=['admin@gmail.com', 'abc@gmail.com']

      const getAllEmailForDoctorReq={
        user: { admin: true, doctor: false },
      }

      const showPatientDetails={
         mockUserId : '123',
         name: 'Prerna', 
         age: 30 
      }

      const getPersonalDetails={
        mockPatientId : '456'
      }

      const mockFamilyInfo={ familyName: 'Satej', members: 4 }

      const createPersonalInfoBody={
        patient_name: 'Prerna Bhise',
        date_of_birth: '2000-01-01',
        gender: 'Female',
        weight: 45,
        height: 150,
        country_of_origin: 'India',
        is_diabetic: false,
        cardiac_issue: false,
        blood_pressure: 'Normal',
      }

      const createPersonalInfoRes={
        mockUserId : '123',
mockEmail : 'prerna@gmail.com'
      }

      const updatePersonalInfoBody={
        patient_name: 'Satej Bhise',
        date_of_birth: '1990-01-01',
        gender: 'Male',
        weight: 50,
        height: 150,
        country_of_origin: 'India',
        is_diabetic: true,
        cardiac_issue: false,
        blood_pressure: true,
        patient_id: '7',
      }

      const updatePersonalInfoRes={
        mockUserId :'123',
       mockIsAdmin : true,
       mockIsAdmin2:false
      }

      const updatePersonalInfoReq={
        patient_name: 'Prerna Bhise',
        date_of_birth: '1990-01-01',
        gender: 'female',
        weight: 50,
        height: 150,
        country_of_origin: 'India',
        is_diabetic: true,
        cardiac_issue: false,
        blood_pressure: true,
        patient_id: '9',
      }

      const getFamilyDetailsBody={
        mockPatientId : '123',
      }

      const getFamilyDetailsRes= {
        "father_name": "abc",
        "father_age": 55,
        "father_country_origin": "India",
        "mother_name": "Urmila",
        "mother_age": 42,
        "mother_country_origin": "India",
        "mother_diabetic": false,
        "mother_cardiac_issue": false,
        "mother_bp": false,
        "father_diabetic": false,
        "father_cardiac_issue": false,
        "father_bp": false,
        "patient_id": 18
      }

      const addFamilyInfoBody= {
    
        "familyDetails": 
          {
            "father_name": "abc",
            "father_age": 55,
            "father_country_origin": "India",
            "mother_name": "Urmila",
            "mother_age": 42,
            "mother_country_origin": "India",
            "mother_diabetic": false,
            "mother_cardiac_issue": false,
            "mother_bp": false,
            "father_diabetic": false,
            "father_cardiac_issue": false,
            "father_bp": false,
            "patient_id": 18
          }
        
    }

    const updateFamilyInfoBody={
      father_name: 'xyz',
      father_age: 50,
      father_country_origin: 'India',
      mother_name: 'pqr',
      mother_age: 48,
      mother_country_origin: 'India',
      mother_diabetic: true,
      mother_cardiac_issue: false,
      mother_bp: false,
      father_diabetic: false,
      father_cardiac_issue: true,
      father_bp: true,
      patient_id: '9',
    }

    const getDiseaseDetailsRes={ disease_type: 'Diabetes', disease_description: 'Moderate' }

    const updateDiseaseInfoBody={ disease_type: 'Flu', disease_description: 'Mild', patient_id: '1' }

    const updateDiseaseInfoReq={ userid: 'u1', admin: false }

    const deleteDiseaseInfoReq={ patient_id: '1' }

    const deleteDiseaseInfoUser={ userid: 'u1', admin: false }

    const getUploadDocumentId={ patient_id: '1' }
   
    const uploadDocumentReq={ document_type: 'xray', patient_id: '1' }

    const uploadSecureUrl={ secure_url: 'cloudinary.com/raw/upload/docs/file1.pdf' }
    export {registerApiBody,regitserId,updatePersonalInfoReq,uploadSecureUrl,uploadDocumentReq,getUploadDocumentId,deleteDiseaseInfoUser,deleteDiseaseInfoReq,getDiseaseDetailsRes,updateDiseaseInfoReq,updateDiseaseInfoBody,updateFamilyInfoBody,addFamilyInfoBody,getFamilyDetailsRes,getFamilyDetailsBody,loginApiBody,updatePersonalInfoRes,updatePersonalInfoBody,createPersonalInfoRes,createPersonalInfoBody,getAllEmailReq,getPersonalDetails,mockFamilyInfo,getAllEmailRes,showPatientDetails,getAllEmailForDoctorReq,getAllAppointmentReq,getPatientsAppointmentResponse,getPatientsAppointmentReq,getAllAppointmentResult,appointmentRequestResult,appointmentRequestUser,approveAppointmentReq,addDoctorBody,appointmentCancelledResult,getAppointmentInformation,appointmentCancelledBody,changeAppointmentsStatusReq,addDoctorUser,deleteDoctorQuery,getAdminParams,getAdminUser,addAdminBody,loginId,updateUserBody,removeAdminReqBody,ageGroupDataZeroResponse,updateUserId,deleteUserBody,getUserBody,getUserResult,adminDeletePatientDataBody,forgotPasswordBody,otpInformation,resetPasswordBody,changePasswordBody,getDoctorResult,createAppointmentBody,getDoctorAvailabilityBody,getDoctorAvailabilityResult,getDoctorAvailabilityResponse,getDoctorAvailabilityNegativeResponse,searchDoctorBody,searchDoctorResult,getDoctorProfile,getDoctorProfileResult,updateDoctorBody,updateDoctorUser,displayAppointmentsBody,displayAppointmentsResult,getAllInfoRequest,getAllInfoPersonal,totalCount,ageGroupDataUser,ageGroupDataSample,ageGroupDataResponse}