const Tool = require('../models/Tool');

const decrementToolsStock = async (toolIds) => {
  const uniqueIds = [...new Set(toolIds.map((id) => id.toString()))];

  const results = await Promise.all(
    uniqueIds.map((id) =>
      Tool.updateOne(
        { _id: id, cantidadDisponible: { $gte: 1 } },
        { $inc: { cantidadDisponible: -1 } }
      )
    )
  );

  const succeededIds = uniqueIds.filter(
    (_id, index) => results[index].modifiedCount === 1
  );

  if (succeededIds.length !== uniqueIds.length) {
    await incrementToolsStock(succeededIds);
    return false;
  }

  return true;
};

const incrementToolsStock = async (toolIds) => {
  const uniqueIds = [...new Set(toolIds.map((id) => id.toString()))];

  await Promise.all(
    uniqueIds.map((id) =>
      Tool.updateOne(
        {
          _id: id,
          $expr: { $lt: ['$cantidadDisponible', '$cantidadTotal'] },
        },
        { $inc: { cantidadDisponible: 1 } }
      )
    )
  );
};

module.exports = {
  decrementToolsStock,
  incrementToolsStock,
};
