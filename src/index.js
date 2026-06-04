const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mediaRoutes = require('./routes/media.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.json({ 
    status: 'FG Downloader Extractor Online',
    timestamp: new Date().toISOString(),
    routes: ['POST /jobs', 'GET /jobs/:id', 'GET /jobs/:id/metadata', 'GET /jobs/:id/formats', 'POST /jobs/:id/download']
  });
});

// Routes
app.use('/', mediaRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
// v2 - forced sync to github
