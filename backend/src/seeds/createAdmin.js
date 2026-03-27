const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();

const requiredEnvVars = [
  'MONGO_URI',
  'ADMIN_NAME',
  'ADMIN_LASTNAME',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'ALLOW_ADMIN_SEED',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Falta la variable de entorno: ${envVar}`);
    process.exit(1);
  }
}

const createAdmin = async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Este script no debe ejecutarse en producción.');
      process.exit(1);
    }

    if (process.env.ALLOW_ADMIN_SEED !== 'true') {
      console.error('❌ Script deshabilitado. Activa ALLOW_ADMIN_SEED=true solo cuando lo necesites.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB conectado');

    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (existingAdmin) {
      console.log('⚠️ Ya existe un usuario con ese email. No se ha modificado.');
      await mongoose.connection.close();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await User.create({
      nombre: process.env.ADMIN_NAME,
      apellido: process.env.ADMIN_LASTNAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin creado correctamente');
    console.log(`📧 Email: ${process.env.ADMIN_EMAIL}`);
    console.log('🔒 La contraseña no se muestra por seguridad.');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando admin:', error.message);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
};

createAdmin();