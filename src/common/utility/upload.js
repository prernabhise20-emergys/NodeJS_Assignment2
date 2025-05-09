import cloudinary from 'cloudinary';
import streamifier from 'streamifier';

const uploadFile = (file,patient_id) => {
  return new Promise((resolve, reject) => {
    console.log(patient_id);
    
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        asset_folder:'Patients_Upload_Documents',
        resource_type: "raw",
        public_id: `documents/${patient_id}/${file.originalname}`,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};
export { uploadFile };