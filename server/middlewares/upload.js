const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/categories');
  },
  filename: function (req, file, cb) {
  cb(null, file.originalname);
}
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  cb(null, allowedTypes.includes(file.mimetype));
};

const upload = multer({ storage, fileFilter });
module.exports=upload;



//____________________-

// const multer = require('multer');
// const sharp = require('sharp');
// const path = require('path');
// const fs = require('fs');

// // Destination folder
// const uploadPath = path.join(__dirname, '../public/uploads/categories');
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath, { recursive: true });
// }

// // Multer config — store in memory so Sharp can process before saving
// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/png'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only JPEG and PNG images are allowed'));
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 2 * 1024 * 1024 } // 2 MB limit
// });

// // Middleware to resize/crop before saving
// const processCategoryImage = async (req, res, next) => {
//   if (!req.file) return next();

//   const filename = `category-${Date.now()}.jpeg`;
//   const outputPath = path.join(uploadPath, filename);

//   try {
//     await sharp(req.file.buffer)
//       .resize(800, 800, {
//         fit: sharp.fit.cover,
//         position: sharp.strategy.entropy
//       })
//       .toFormat('jpeg')
//       .jpeg({ quality: 85 })
//       .toFile(outputPath);

//     req.savedFilename = filename;
//     next();
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = { upload, processCategoryImage };


