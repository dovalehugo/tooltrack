const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

async function resetDemoLimits() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOneAndUpdate(
      { email: 'demo@tooltrack.com', role: 'demo' },
      {
        $set: {
          demoLimits: {
            employeeCreates: 0,
            employeeDeletes: 0,
            toolCreates: 0,
            toolDeletes: 0,
            loanCreates: 0,
            loanReturns: 0,
          },
        },
      },
      { new: true }
    );

    if (!user) {
      console.log('Usuario demo no encontrado');
    } else {
      console.log('Límites del usuario demo reseteados correctamente');
    }

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

resetDemoLimits();