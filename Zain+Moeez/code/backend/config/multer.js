const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ================================
// STORAGE CONFIG
// ================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/images'; // default

    if (file.fieldname === 'modelFile') {
      folder = 'uploads/models';
    }

    // Folder exist nahi toh banao
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// ================================
// FILE FILTER
// ================================
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'images') {
    // Sirf images allow karo
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, PNG, WEBP images are allowed'), false);
    }
  } else if (file.fieldname === 'modelFile') {
    // Sirf .glb / .gltf allow karo
    const allowedExts = /glb|gltf/;
    const extname = allowedExts.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Only .glb and .gltf 3D model files are allowed'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

// ================================
// MULTER INSTANCE
// ================================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB max (3D models ke liye)
  },
});

module.exports = upload;
