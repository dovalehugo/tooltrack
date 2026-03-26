const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB conectado');

    const existingAdmin = await User.findOne({ email: 'admin@tooltrack.com' });

    if (existingAdmin) {
      console.log('ℹ️ El admin ya existe');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin1234*', 10);

    await User.create({
      email: 'admin@tooltrack.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin creado correctamente');
    console.log('📧 Email: admin@tooltrack.com');
    console.log('🔑 Password: Admin1234*');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando admin:', error.message);
    process.exit(1);
  }
};

createAdmin();