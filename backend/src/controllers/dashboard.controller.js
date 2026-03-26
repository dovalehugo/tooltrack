const Employee = require('../models/Employee');
const Tool = require('../models/Tool');
const Loan = require('../models/Loan');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalEmployees, tools, recentLoans, activeLoans] = await Promise.all([
      Employee.countDocuments(),
      Tool.find(),
      Loan.find()
        .populate('employee')
        .populate('tool')
        .sort({ createdAt: -1 })
        .limit(8),
      Loan.find({ estado: 'activo' })
        .populate('employee')
        .populate('tool')
        .sort({ fechaPrestamo: -1 })
        .limit(10),
    ]);

    const totalTools = tools.reduce(
      (acc, tool) => acc + (Number(tool.cantidadTotal) || 0),
      0
    );

    const totalAvailable = tools.reduce(
      (acc, tool) => acc + (Number(tool.cantidadDisponible) || 0),
      0
    );

    const totalBorrowed = totalTools - totalAvailable;

    const outOfStockCount = tools.filter(
      (tool) => Number(tool.cantidadDisponible) === 0
    ).length;

    const lowStockTools = tools
      .filter((tool) => {
        const total = Number(tool.cantidadTotal) || 0;
        const available = Number(tool.cantidadDisponible) || 0;
        return available > 0 && available <= 2 && total > 0;
      })
      .sort((a, b) => a.cantidadDisponible - b.cantidadDisponible)
      .slice(0, 8);

    const outOfStockTools = tools
      .filter((tool) => Number(tool.cantidadDisponible) === 0)
      .slice(0, 8);

    res.json({
      kpis: {
        totalEmployees,
        totalTools,
        totalAvailable,
        totalBorrowed,
        outOfStockCount,
      },
      lowStockTools,
      outOfStockTools,
      recentLoans,
      activeLoans,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};