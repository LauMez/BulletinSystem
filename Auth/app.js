import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { thisPORT } from './config.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bodyParser from 'body-parser';

import { createAuthRouter } from './routes/auth.js';

import { createProxyMiddleware } from 'http-proxy-middleware';
import { corsMiddleware } from './middlewares/cors.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import { authorize } from './middlewares/authorizeMiddleware.js';

export const createApp = ({ authModel }) => {
  const app = express();
  app.use(json());
  app.use(cookieParser());
  app.use(corsMiddleware());
  app.disable('x-powered-by');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(authMiddleware);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, 'public')));

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use('/student', authorize(['student']), createProxyMiddleware({ target: `http://localhost:4567` }));
  app.use('/professor', authorize(['professor']), createProxyMiddleware({ target: `http://localhost:8734` }));
  app.use('/directive', authorize(['directive']), createProxyMiddleware({ target: `http://localhost:9457` }));
  app.use('/preceptor', authorize(['preceptor']), createProxyMiddleware({ target: `http://localhost:6534` }));
  app.use('/responsible', authorize(['responsible']), createProxyMiddleware({ target: `http://localhost:6534` }));

  app.use('/', createAuthRouter({ authModel }));

  const PORT = thisPORT || 7654;

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
  });
};