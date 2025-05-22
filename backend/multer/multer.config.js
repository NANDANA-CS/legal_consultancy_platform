// import multer from "multer"
// import path from 'path'

// const storage = multer.diskStorage({
//     destination:(req,file,cb)=>cb(null,"images/"),
//     filename:(req,file,cb)=>{
//         cb(null,Date.now()+ "-" +path.extname(file.originalname))           
//     }   
// })
// const upload = multer({storage})
// export default upload


import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'images/'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and JPG images are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export default upload;