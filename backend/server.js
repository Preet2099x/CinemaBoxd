import express from 'express';
import cors from 'cors'; // Import CORS package
import loginRoutes from './routes/loginRoutes.js';
import signupRoutes from './routes/signupRoutes.js';

const app = express();
const PORT = 8000;

// Add CORS middleware before your routes
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('CinemaBoxd backend is running!');
});

app.use('/api', loginRoutes);
app.use('/api', signupRoutes);

app.listen(PORT, () => { // Removed the bitwise OR (|) operator which was incorrect
  console.log(`Server is running at PORT:${PORT}`);
});