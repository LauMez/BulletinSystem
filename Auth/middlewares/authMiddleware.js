import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config.js';

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.access_token;
  req.session = { user: null };

  if (token) {
    try {
      const data = jwt.verify(token, SECRET_KEY);
      req.session.user = data;
    } catch (error) {
      console.error('Invalid token:', error.message);
    }
  }

  next();
};