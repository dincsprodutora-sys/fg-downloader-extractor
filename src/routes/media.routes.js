const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/media.controller');

router.post('/jobs', mediaController.createJob);
router.get('/jobs/:id', mediaController.getJobStatus);
router.get('/jobs/:id/metadata', mediaController.getMetadata);
router.get('/jobs/:id/formats', mediaController.getFormats);
router.post('/jobs/:id/download', mediaController.generateDownload);

module.exports = router;
// v2 - forced sync to github
