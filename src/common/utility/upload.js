import cloudinary from 'cloudinary';
import streamifier from 'streamifier';

const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id: `documents/${file.originalname}`,
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
