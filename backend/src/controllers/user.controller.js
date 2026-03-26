const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const { nombre, apellido, email, password, role } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({
        message: 'Nombre, apellido, email y contraseña son obligatorios',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};