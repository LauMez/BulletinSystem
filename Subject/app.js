import express, { json } from 'express';
import { createSubjectRouter } from './routes/subject.js';
import { corsMiddleware } from './middlewares/cors.js';
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import axios from 'axios';

export const createApp = ({ subjectModel }) => {
  const app = express();
  app.use(json());
  app.use(corsMiddleware());
  app.disable('x-powered-by');

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use('/subject', createSubjectRouter({ subjectModel }));

  const PORT = process.env.PORT ?? 4321;

  app.get('/', async (req, res) => {
    const response = await axios.get(`http://localhost:${PORT}/subject`);
    const subjects = response.data;
    res.render('index', {subjects});
  });

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
  });
};