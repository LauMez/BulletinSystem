import express from 'express'
import proxy from 'express-http-proxy'

const app = express();

app.use('/student', proxy('http://localhost:4567'));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API Gateway corriendo en http://localhost:${PORT}`);
});
