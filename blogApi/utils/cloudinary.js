const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

// Helper to check configuration
const isConfigured = () => {
  if (process.env.CLOUDINARY_URL) return true;
  return !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

// Configure only if env vars are present (avoid throwing at module load)
if (isConfigured()) {
  // If CLOUDINARY_URL is set, the library will pick it up; we provide secure: true as default
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const uploadStream = (buffer, folder = 'blogapp') => {
  return new Promise((resolve, reject) => {
    if (!isConfigured()) {
      return reject(new Error('Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET (or CLOUDINARY_URL) in your environment.'));
    }

    try {
      const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      stream.end(buffer);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { cloudinary, uploadStream };
