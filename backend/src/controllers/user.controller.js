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

    if (password.length < 8) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 8 caracteres',
      });
    }

    const allowedRoles = ['admin', 'user', 'demo'];

    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        message: 'Rol no válido',
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

    res.status(201).json(user.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === String(req.user.id)) {
      return res.status(400).json({
        message: 'No puedes eliminar tu propio usuario',
      });
    }

    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (userToDelete.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });

      if (adminCount <= 1) {
        return res.status(400).json({
          message: 'No se puede eliminar el último administrador',
        });
      }
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};