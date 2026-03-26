const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employee.routes');
const toolRoutes = require('./routes/tool.routes');
const loanRoutes = require('./routes/loan.routes');
const settingRoutes = require('./routes/setting.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// Conectar a MongoDB
connectDB();

// CORS
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('No permitido por CORS'));
    },
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de ToolTrack funcionando correctamente',
  });
});

module.exports = app;