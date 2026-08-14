const Tool = require('../models/Tool');
const Loan = require('../models/Loan');
const User = require('../models/User');

// CREATE
exports.createTool = async (req, res) => {
  try {
    const { nombre, cantidadTotal } = req.body;

    if (!nombre?.toString().trim()) {
      return res.status(400).json({
        message: 'El nombre de la herramienta es obligatorio',
      });
    }

    const total = Number(cantidadTotal) || 1;

    if (total < 1) {
      return res.status(400).json({
        message: 'La cantidad total debe ser al menos 1',
      });
    }

    const tool = await Tool.create({
      nombre: nombre.toString().trim(),
      cantidadTotal: total,
      cantidadDisponible: total,
    });

    if (req.user?.role === 'demo') {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { 'demoLimits.toolCreates': 1 },
      });
    }

    res.status(201).json(tool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
exports.getTools = async (req, res) => {
  try {
    const tools = await Tool.find();
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateTool = async (req, res) => {
  try {
    const { nombre, cantidadTotal } = req.body;

    const tool = await Tool.findById(req.params.id);

    if (!tool) {
      return res.status(404).json({ message: 'Herramienta no encontrada' });
    }

    if (nombre !== undefined && !nombre.toString().trim()) {
      return res.status(400).json({
        message: 'El nombre de la herramienta es obligatorio',
      });
    }

    const activeLoansCount = await Loan.countDocuments({
      tools: tool._id,
      estado: 'activo',
    });

    const newTotal =
      cantidadTotal !== undefined ? Number(cantidadTotal) : tool.cantidadTotal;

    if (!Number.isFinite(newTotal) || newTotal < 1) {
      return res.status(400).json({
        message: 'La cantidad total debe ser al menos 1',
      });
    }

    if (newTotal < activeLoansCount) {
      return res.status(400).json({
        message:
          'La cantidad total no puede ser menor que las herramientas actualmente prestadas',
      });
    }

    tool.nombre = nombre !== undefined ? nombre.toString().trim() : tool.nombre;
    tool.cantidadTotal = newTotal;
    tool.cantidadDisponible = newTotal - activeLoansCount;

    await tool.save();

    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteTool = async (req, res) => {
  try {
    const activeLoan = await Loan.findOne({
      tools: req.params.id,
      estado: 'activo',
    });

    if (activeLoan) {
      return res.status(400).json({
        message:
          'No se puede eliminar la herramienta porque tiene préstamos activos',
      });
    }

    const deletedTool = await Tool.findByIdAndDelete(req.params.id);

    if (!deletedTool) {
      return res.status(404).json({ message: 'Herramienta no encontrada' });
    }

    if (req.user?.role === 'demo') {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { 'demoLimits.toolDeletes': 1 },
      });
    }

    res.json({ message: 'Herramienta eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// IMPORT CSV
exports.importTools = async (req, res) => {
  try {
    const { tools } = req.body;

    if (!Array.isArray(tools) || tools.length === 0) {
      return res.status(400).json({
        message: 'Debes enviar un array de herramientas',
      });
    }

    if (tools.length > 500) {
      return res.status(400).json({
        message: 'Máximo 500 herramientas por importación',
      });
    }

    const validTools = [];
    const errors = [];

    tools.forEach((tool, index) => {
      const nombre = tool.nombre?.toString().trim();
      const cantidadTotal = Number(tool.cantidadTotal);

      if (!nombre || !cantidadTotal || cantidadTotal < 1) {
        errors.push({
          row: index + 1,
          message: 'Cada fila debe tener nombre y cantidadTotal válida',
        });
        return;
      }

      validTools.push({
        nombre,
        cantidadTotal,
        cantidadDisponible: cantidadTotal,
      });
    });

    if (validTools.length === 0) {
      return res.status(400).json({
        message: 'No hay herramientas válidas para importar',
        errors,
      });
    }

    const insertedTools = await Tool.insertMany(validTools);

    res.status(201).json({
      message: 'Importación completada',
      inserted: insertedTools.length,
      errors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};