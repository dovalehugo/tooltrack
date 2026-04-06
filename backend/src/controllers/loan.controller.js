const Loan = require('../models/Loan');
const Tool = require('../models/Tool');
const Employee = require('../models/Employee');
const User = require('../models/User');

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

// CREATE OR APPEND TO TODAY ACTIVE LOAN
exports.createLoan = async (req, res) => {
  try {
    const { employee, tools } = req.body;

    if (!employee) {
      return res.status(400).json({ message: 'Debes seleccionar un empleado' });
    }

    if (!Array.isArray(tools) || tools.length === 0) {
      return res
        .status(400)
        .json({ message: 'Debes añadir al menos una herramienta al préstamo' });
    }

    const uniqueToolIds = [...new Set(tools)];

    const existingEmployee = await Employee.findById(employee);
    if (!existingEmployee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    const existingTools = await Tool.find({ _id: { $in: uniqueToolIds } });

    if (existingTools.length !== uniqueToolIds.length) {
      return res.status(404).json({
        message: 'Una o varias herramientas no existen',
      });
    }

    const unavailableTool = existingTools.find(
      (tool) => Number(tool.cantidadDisponible) <= 0
    );

    if (unavailableTool) {
      return res.status(400).json({
        message: `No hay unidades disponibles de la herramienta "${unavailableTool.nombre}"`,
      });
    }

    const { start, end } = getTodayRange();

    let loan = await Loan.findOne({
      employee,
      estado: 'activo',
      fechaPrestamo: {
        $gte: start,
        $lte: end,
      },
    });

    if (loan) {
      const currentToolIds = loan.tools.map((toolId) => toolId.toString());

      const newToolIds = uniqueToolIds.filter(
        (toolId) => !currentToolIds.includes(toolId.toString())
      );

      if (newToolIds.length === 0) {
        return res.status(400).json({
          message:
            'Todas las herramientas seleccionadas ya están incluidas en el préstamo activo de hoy',
        });
      }

      loan.tools.push(...newToolIds);
      await loan.save();

      const toolsToDiscount = existingTools.filter((tool) =>
        newToolIds.includes(tool._id.toString())
      );

      await Promise.all(
        toolsToDiscount.map(async (tool) => {
          tool.cantidadDisponible -= 1;
          await tool.save();
        })
      );

      const populatedLoan = await Loan.findById(loan._id)
        .populate('employee')
        .populate('tools');

      return res.status(200).json({
        message: 'Herramientas añadidas al préstamo activo del empleado',
        loan: populatedLoan,
      });
    }

    loan = await Loan.create({
      employee,
      tools: uniqueToolIds,
    });

    await Promise.all(
      existingTools.map(async (tool) => {
        tool.cantidadDisponible -= 1;
        await tool.save();
      })
    );

    if (req.user?.role === 'demo') {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { 'demoLimits.loanCreates': 1 },
      });
    }

    const populatedLoan = await Loan.findById(loan._id)
      .populate('employee')
      .populate('tools');

    res.status(201).json({
      message: 'Préstamo creado correctamente',
      loan: populatedLoan,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate('employee')
      .populate('tools')
      .sort({ createdAt: -1 });

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD TOOL TO ACTIVE LOAN
exports.addToolToLoan = async (req, res) => {
  try {
    const { toolId } = req.body;

    if (!toolId) {
      return res
        .status(400)
        .json({ message: 'Debes seleccionar una herramienta' });
    }

    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }

    if (loan.estado !== 'activo') {
      return res.status(400).json({
        message: 'Solo se pueden editar préstamos activos',
      });
    }

    const tool = await Tool.findById(toolId);

    if (!tool) {
      return res.status(404).json({ message: 'Herramienta no encontrada' });
    }

    if (Number(tool.cantidadDisponible) <= 0) {
      return res.status(400).json({
        message: 'No hay unidades disponibles de esta herramienta',
      });
    }

    const alreadyInLoan = loan.tools.some(
      (currentToolId) => currentToolId.toString() === toolId
    );

    if (alreadyInLoan) {
      return res.status(400).json({
        message: 'La herramienta ya está incluida en este préstamo',
      });
    }

    loan.tools.push(toolId);
    await loan.save();

    tool.cantidadDisponible -= 1;
    await tool.save();

    const populatedLoan = await Loan.findById(loan._id)
      .populate('employee')
      .populate('tools');

    res.json({
      message: 'Herramienta añadida al préstamo',
      loan: populatedLoan,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE TOOL FROM ACTIVE LOAN
exports.removeToolFromLoan = async (req, res) => {
  try {
    const { id, toolId } = req.params;

    const loan = await Loan.findById(id);

    if (!loan) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }

    if (loan.estado !== 'activo') {
      return res.status(400).json({
        message: 'Solo se pueden editar préstamos activos',
      });
    }

    const toolExistsInLoan = loan.tools.some(
      (currentToolId) => currentToolId.toString() === toolId
    );

    if (!toolExistsInLoan) {
      return res.status(404).json({
        message: 'La herramienta no pertenece a este préstamo',
      });
    }

    loan.tools = loan.tools.filter(
      (currentToolId) => currentToolId.toString() !== toolId
    );

    const tool = await Tool.findById(toolId);
    if (tool) {
      tool.cantidadDisponible += 1;

      if (tool.cantidadDisponible > tool.cantidadTotal) {
        tool.cantidadDisponible = tool.cantidadTotal;
      }

      await tool.save();
    }

    if (loan.tools.length === 0) {
      loan.estado = 'devuelto';
      loan.fechaDevolucionReal = new Date();
    }

    await loan.save();

    const populatedLoan = await Loan.findById(loan._id)
      .populate('employee')
      .populate('tools');

    res.json({
      message:
        loan.estado === 'devuelto'
          ? 'La última herramienta fue retirada y el préstamo quedó devuelto'
          : 'Herramienta eliminada del préstamo',
      loan: populatedLoan,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RETURN LOAN
exports.returnLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }

    if (loan.estado === 'devuelto') {
      return res.status(400).json({ message: 'El préstamo ya está devuelto' });
    }

    const tools = await Tool.find({ _id: { $in: loan.tools } });

    await Promise.all(
      tools.map(async (tool) => {
        tool.cantidadDisponible += 1;

        if (tool.cantidadDisponible > tool.cantidadTotal) {
          tool.cantidadDisponible = tool.cantidadTotal;
        }

        await tool.save();
      })
    );

    loan.estado = 'devuelto';
    loan.fechaDevolucionReal = new Date();

    await loan.save();

    if (req.user?.role === 'demo') {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { 'demoLimits.loanReturns': 1 },
      });
    }

    res.json({ message: 'Préstamo devuelto correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};