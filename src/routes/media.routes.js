import express from 'express';

import {
  createJob,
  getJobStatus,
  getMetadata,
  getFormats,
  generateDownload
} from '../controllers/media.controller.js';

const router = express.Router();

router.post('/jobs', createJob);
router.get('/jobs/:id', getJobStatus);
router.get('/jobs/:id/metadata', getMetadata);
router.get('/jobs/:id/formats', getFormats);
router.post('/jobs/:id/download', generateDownload);

export default router;
