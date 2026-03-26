const Loan = require('../models/Loan');
const Tool = require('../models/Tool');
const Employee = require('../models/Employee');

// CREATE
exports.createLoan = async (req, res) => {
  try {
    const { employee, tool } = req.body;

    const existingEmployee = await Employee.findById(employee);
    if (!existingEmployee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    const existingTool = await Tool.findById(tool);
    if (!existingTool) {
      return res.status(404).json({ message: 'Herramienta no encontrada' });
    }

    if (existingTool.cantidadDisponible <= 0) {
      return res
        .status(400)
        .json({ message: 'No hay unidades disponibles de esta herramienta' });
    }

    const loan = await Loan.create({
      employee,
      tool,
    });

    existingTool.cantidadDisponible -= 1;
    await existingTool.save();

    const populatedLoan = await Loan.findById(loan._id)
      .populate('employee')
      .populate('tool');

    res.status(201).json(populatedLoan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate('employee')
      .populate('tool');

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RETURN TOOL
exports.returnLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }

    if (loan.estado === 'devuelto') {
      return res.status(400).json({ message: 'Ya está devuelto' });
    }

    const tool = await Tool.findById(loan.tool);
    if (tool) {
      tool.cantidadDisponible += 1;

      if (tool.cantidadDisponible > tool.cantidadTotal) {
        tool.cantidadDisponible = tool.cantidadTotal;
      }

      await tool.save();
    }

    loan.estado = 'devuelto';
    loan.fechaDevolucionReal = new Date();

    await loan.save();

    res.json({ message: 'Herramienta devuelta correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};