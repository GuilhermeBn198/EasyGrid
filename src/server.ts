import express from 'express';
import router from './routes/router';
import errorHandler from './middleware/errorHandler';

const app = express();

app.use(express.json());
app.use('/api', router);

// Middleware de manipulação de erros
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;