import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mediaRoutes from './routes/media.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'FG Downloader Extractor Online',
    timestamp: new Date().toISOString(),
    routes: [
      'POST /jobs',
      'GET /jobs/:id',
      'GET /jobs/:id/metadata',
      'GET /jobs/:id/formats',
      'POST /jobs/:id/download'
    ]
  });
});

app.use('/', mediaRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erro interno no servidor'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
