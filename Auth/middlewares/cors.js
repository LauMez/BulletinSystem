import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:7654',
  'http://localhost:4000'
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
  }
});
