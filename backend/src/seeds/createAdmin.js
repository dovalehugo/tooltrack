const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB conectado');

    const hashedPassword = await bcrypt.hash('Admin1234*', 10);

    const adminData = {
      nombre: 'Admin',
      apellido: 'ToolTrack',
      email: 'admin@tooltrack.com',
      password: hashedPassword,
      role: 'admin',
    };

    const existingAdmin = await User.findOne({ email: 'admin@tooltrack.com' });

    if (existingAdmin) {
      await User.updateOne(
        { email: 'admin@tooltrack.com' },
        { $set: adminData }
      );

      console.log('✅ Admin actualizado correctamente');
      console.log('📧 Email: admin@tooltrack.com');
      console.log('🔑 Password: Admin1234*');
      process.exit(0);
    }

    await User.create(adminData);

    console.log('✅ Admin creado correctamente');
    console.log('📧 Email: admin@tooltrack.com');
    console.log('🔑 Password: Admin1234*');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando/actualizando admin:', error.message);
    process.exit(1);
  }
};

createAdmin();