import express from 'express';
import cors from 'cors';
import http from 'http';
import router from './routes/router';
import errorHandler from './middleware/errorHandler';

const app = express();

// Configurar CORS
app.use(cors({
  origin:  ['http://localhost:3000', 'http://outro-dominio.com'],// ou o domínio da sua aplicação frontend
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
}));

app.use(express.json());
app.use('/api', router);

// Middleware de manipulação de erros
app.use(errorHandler);

// Initial port
let PORT = process.env.PORT || "3000";

// Function to start the server
const startServer = (PORT: string) => {
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Handle EADDRINUSE error
  server.on('error', (error) => {
    if (error.name === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
      const newPort = "3001"; // Alternative port
      console.log(`Attempting to start server on port ${newPort} instead.`);
      startServer(newPort); // Try starting the server on thez alternative port
    }
  });
};

// Start the server
startServer(PORT);

export default app;
