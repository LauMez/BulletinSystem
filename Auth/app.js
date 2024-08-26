import express, { json } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

import { createAuthRouter } from './routes/auth.js';

import { corsMiddleware } from './middlewares/cors.js';
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bodyParser from 'body-parser';
import { SECRET_KEY } from './config.js';

export const createApp = ({ authModel }) => {
  const app = express();
  app.use(json());
  app.use(cookieParser());
  app.use(corsMiddleware());
  app.disable('x-powered-by');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use((req, res, next) => {
    const token = req.cookies.access_token
    req.session = { user: null }

    try {
      const data = jwt.verify(token, SECRET_KEY)
      req.session.user = data
    } catch{}

    next()
  });

  app.use('/public', express.static('public'));
  app.use('/public', express.static(path.join(__dirname, 'public')));

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');


  app.use('/', createAuthRouter({ authModel }));

  const PORT = process.env.PORT ?? 7654;

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
  });
};