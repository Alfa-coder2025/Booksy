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
