require('dotenv').config();
const app = require('./app');

if (!process.env.JWT_SECRET) {
  console.error('❌ Falta la variable de entorno JWT_SECRET');
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error('❌ Falta la variable de entorno MONGO_URI');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend de ToolTrack ejecutándose en http://localhost:${PORT}`);
});