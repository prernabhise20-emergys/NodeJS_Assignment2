import multer from 'multer';
import cloudinary from 'cloudinary';

const storage = multer.memoryStorage();

// const uploadMultiple = multer({ storage }).array('files[]', 10);

// const uploadSingle = multer({ storage }).single('file'); 
const upload = multer({ storage })
export {  upload };
