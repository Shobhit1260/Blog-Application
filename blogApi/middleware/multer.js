const multer = require('multer');
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
	const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
	if (allowed.includes(file.mimetype)) cb(null, true);
	else cb(new Error('Invalid file type. Only JPG, PNG, WEBP, GIF and SVG are allowed.'), false);
};

const limits = {
	fileSize: 5 * 1024 * 1024 // 5 MB
};

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;