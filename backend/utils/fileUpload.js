const multer = require('multer');

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the destination folder where uploaded files will be stored
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Define how the filename should be saved
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Initialize multer
const upload = multer({ storage });

module.exports = upload;
