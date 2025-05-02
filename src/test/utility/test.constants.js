const APPROVE_APPOINTMENT={
    email : 'test@gmail.com',
     patient_name : 'Prerna Bhise',
     appointment_date : '2025-05-05',
    appointment_time : '10:00 AM',
  doctorName : 'Dr. Satej'
  
}

const CANCELLED_APPOINTMENT={
     email :'test@gmail.com',
  reason : 'Doctor unavailable',
  patientName : 'Prerna Bhise',
   appointmentDate :'2025-05-05',
   appointmentTime : '10:00 AM',
   doctorName :'Dr. Satej'
}

const SAMPLE_DATA=
    {
        medicines: ['Paracetamol', 'Amoxicillin'],
        capacity: ['500mg', '250mg'],
        dosage: ['1 tablet', '1 capsule'],
        morning: [true, 'both'],
        afternoon: [false, false],
        evening: ['after', true],
        courseDuration: 5,
      }

      const CREATE_PRESCRIPTION={
         patientName : 'Prerna Bhise',
   appointmentDate : '2025-05-05',
   age : 23,
   gender : 'Female',
   doctorName :'Dr. Satej',
   specialization : 'General Physician',
   birthDate : '1995-01-01'
      }

      const SEND_OTP={
         email : 'test@gmail.com',
         name :'Prerna Bhise',
         otp :'123456'
      }

      const SEND_PRESCRIPTION={
          email : 'test@gmail.com',
          cloudinaryUrl : 'http://example.com/prescription.pdf'
      }

      const SEND_REGISTER_CODE={
          email : 'test@gmail.com',
   name : 'Prerna Bhise',
   code : 'USR123',
   user_password : 'pass123',
   loginToken : 'bdjsbhjxnmahbsn '
      }
export default{APPROVE_APPOINTMENT,CANCELLED_APPOINTMENT,SEND_REGISTER_CODE,SAMPLE_DATA,CREATE_PRESCRIPTION,SEND_OTP,SEND_PRESCRIPTION}