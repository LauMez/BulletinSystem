import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:7654',
  'http://localhost:4567',
  'http://localhost:8734',
  'http://localhost:6348',
  'http://localhost:9457',
  'http://localhost:6534',
  'http://localhost:1234',
  'http://localhost:4321'
];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true);
    };

    if (!origin) {
      return callback(null, true);
    };

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
});
