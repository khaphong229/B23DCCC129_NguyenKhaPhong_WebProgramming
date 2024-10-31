const express = require('express');
const router = express.Router();

const meController = require('../app/controllers/meController');

router.get('/trash/courses', meController.trash);

module.exports = router;