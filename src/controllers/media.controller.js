const { v4: uuidv4 } = require('uuid');
const ytDlpService = require('../services/yt-dlp.service');

// Em produção, isso deveria estar em um Redis ou banco de dados
const jobs = new Map();

exports.createJob = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL é obrigatória' });

    const id = uuidv4();
    const job = {
      id,
      url,
      status: 'completed', // Como estamos fazendo extração direta agora, o status pode ser completado
      created_at: new Date().toISOString()
    };
    
    jobs.set(id, job);
    res.status(201).json(job);
  } catch (error) {
    console.error('Erro ao criar job:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getJobStatus = (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job não encontrado' });
  res.json(job);
};

exports.getMetadata = async (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job não encontrado' });
  
  try {
    const metadata = await ytDlpService.getMetadata(job.url);
    res.json(metadata);
  } catch (error) {
    console.error('Erro ao buscar metadados:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getFormats = async (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job não encontrado' });

  try {
    const formats = await ytDlpService.getFormats(job.url);
    res.json(formats);
  } catch (error) {
    console.error('Erro ao buscar formatos:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.generateDownload = async (req, res) => {
  const job = jobs.get(req.params.id);
  const { format_id } = req.body;
  
  if (!job) return res.status(404).json({ error: 'Job não encontrado' });
  if (!format_id) return res.status(400).json({ error: 'format_id é obrigatório' });

  try {
    const downloadInfo = await ytDlpService.getDownloadUrl(job.url, format_id);
    res.json(downloadInfo);
  } catch (error) {
    console.error('Erro ao gerar download:', error);
    res.status(500).json({ error: error.message });
  }
};
// v2 - forced sync to github
