import { v4 as uuidv4 } from 'uuid';
import ytDlpService from '../services/yt-dlp.service.js';

// Em produção, isso deveria estar em um Redis ou banco de dados
const jobs = new Map();

export const createJob = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: 'URL é obrigatória'
      });
    }

    const id = uuidv4();

    const job = {
      id,
      url,
      status: 'completed',
      created_at: new Date().toISOString()
    };

    jobs.set(id, job);

    res.status(201).json(job);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
};

export const getJobStatus = (req, res) => {
  const job = jobs.get(req.params.id);

  if (!job) {
    return res.status(404).json({
      error: 'Job não encontrado'
    });
  }

  res.json(job);
};

export const getMetadata = async (req, res) => {
  const job = jobs.get(req.params.id);

  if (!job) {
    return res.status(404).json({
      error: 'Job não encontrado'
    });
  }

  try {
    const metadata = await ytDlpService.getMetadata(job.url);
    res.json(metadata);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
};

export const getFormats = async (req, res) => {
  const job = jobs.get(req.params.id);

  if (!job) {
    return res.status(404).json({
      error: 'Job não encontrado'
    });
  }

  try {
    const formats = await ytDlpService.getFormats(job.url);
    res.json(formats);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
};

export const generateDownload = async (req, res) => {
  const job = jobs.get(req.params.id);

  if (!job) {
    return res.status(404).json({
      error: 'Job não encontrado'
    });
  }

  const { format_id } = req.body;

  if (!format_id) {
    return res.status(400).json({
      error: 'format_id é obrigatório'
    });
  }

  try {
    const downloadInfo = await ytDlpService.getDownloadUrl(
      job.url,
      format_id
    );

    res.json(downloadInfo);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
};
