const express = require('express');
const router = express.Router();
const { generateArticle } = require('../controllers/aicontroller');
const protect = require('../middleware/auth');

router.post('/generate-article', protect, generateArticle);

module.exports = router;
