const Employee = require('../models/Employee');
const User = require('../models/User');

// CREATE
exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);

    if (req.user?.role === 'demo') {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { 'demoLimits.employeeCreates': 1 },
      });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
exports.getEmployees = async (req, res) => {
  try {
    const { search, department } = req.query;

    let filter = {};

    if (search) {
      filter.nombre = { $regex: search, $options: 'i' };
    }

    if (department) {
      filter.departamento = department;
    }

    const employees = await Employee.find(filter);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);

    if (req.user?.role === 'demo') {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { 'demoLimits.employeeDeletes': 1 },
      });
    }

    res.json({ message: 'Empleado eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// IMPORT CSV
exports.importEmployees = async (req, res) => {
  try {
    const { employees } = req.body;

    if (!Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({
        message: 'Debes enviar un array de empleados',
      });
    }

    const validEmployees = [];
    const errors = [];

    employees.forEach((emp, index) => {
      const nombre = emp.nombre?.toString().trim();
      const apellido = emp.apellido?.toString().trim();
      const departamento = emp.departamento?.toString().trim();

      if (!nombre || !apellido || !departamento) {
        errors.push({
          row: index + 1,
          message: 'Faltan campos obligatorios: nombre, apellido o departamento',
        });
        return;
      }

      validEmployees.push({
        nombre,
        apellido,
        departamento,
      });
    });

    if (validEmployees.length === 0) {
      return res.status(400).json({
        message: 'No hay empleados válidos para importar',
        errors,
      });
    }

    const insertedEmployees = await Employee.insertMany(validEmployees);

    res.status(201).json({
      message: 'Importación completada',
      inserted: insertedEmployees.length,
      errors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};