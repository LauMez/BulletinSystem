import express, { json } from 'express';

import { createPreceptorRouter } from './routes/preceptor.js';

import { corsMiddleware } from './middlewares/cors.js';
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bodyParser from 'body-parser';

export const createApp = ({ preceptorModel }) => {
  const app = express();
  app.use(json());
  app.use(corsMiddleware());
  app.disable('x-powered-by');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use('/public', express.static('public'));
  app.use('/public', express.static(path.join(__dirname, 'public')));

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use('/preceptor', createPreceptorRouter({ preceptorModel }));

  const PORT = process.env.PORT ?? 6534;

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
  });
};