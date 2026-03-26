require('dotenv').config();
const mongoose = require('mongoose');

const Tool = require('../models/Tool');
const Loan = require('../models/Loan');

async function cleanOldData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Loan.deleteMany({});
    await Tool.deleteMany({});

    console.log('Préstamos y herramientas eliminados correctamente');
    process.exit(0);
  } catch (error) {
    console.error('Error limpiando datos:', error);
    process.exit(1);
  }
}

cleanOldData();