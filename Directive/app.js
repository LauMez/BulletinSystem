import express, { json } from 'express';

import { createDirectiveRouter } from './routes/directive.js';
import { createIndexRouter } from './routes/index.js';

import { corsMiddleware } from './middlewares/cors.js';
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bodyParser from 'body-parser';

export const createApp = ({ directiveModel, indexModel }) => {
  const app = express();
  app.use(json());
  app.use(corsMiddleware());
  app.disable('x-powered-by');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, 'public')));

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use('/directive', createDirectiveRouter({ directiveModel }));
  app.use('/', createIndexRouter({ indexModel }))

  const PORT = process.env.PORT ?? 9457;

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
  });
};