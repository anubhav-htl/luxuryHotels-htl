import multer from "multer";
import path from "path";

// Middleware to create multer with custom path
export const createMulterMiddleware = (folderPath) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Set the destination folder where images will be saved
      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      // Set the unique file name
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });

  const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpeg, .jpg, and .png formats are allowed!'), false);
    }
  };

  return multer({ storage, fileFilter });
};

// Middleware for single file upload
// export const uploadSingle = (folderPath) => createMulterMiddleware(folderPath).single('image');

// // Middleware for multiple file upload
// export const uploadMultiple = (folderPath) => createMulterMiddleware(folderPath).array('images', 10);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     console.log(req);
    
//     // Set the destination folder where images will be saved
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     // Set the unique file name for each image
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// // Multer middleware for handling single or multiple uploads
// export const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
//     if (allowedMimeTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Invalid file type. Only JPEG and PNG are allowed!"));
//     }
//   },
// });
