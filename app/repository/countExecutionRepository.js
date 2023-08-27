const sequelize = require("sequelize");
const { Op } = sequelize;
const { CountExecution } = require("../models");

async function dbCreateCountExecution(countPlanId) {
  return CountExecution.cache().create({
    countPlanId,
    status: "started",
  });
}
async function dbGetCountExecutions() {
  return CountExecution.cache("count-executions").findAll({
    query: { raw: true },
  });
}

async function dbGetCountExecutionById(countPlanId) {
  const countExecution = await CountExecution.cache(
    `cache-execution-count-plan-${countPlanId}`
  ).findOne({
    where: { countPlanId },
    query: { raw: true },
    // attributes: ["countPlanId", "status"],
  });

  // workaround because sometimes sequelize throws an error when using 'raw:true' flag
  return countExecution;
}

async function dbStopCountExecution(countPlanId) {
  const countExecution = await CountExecution.cache(
    `cache-execution-count-plan-${countPlanId}`
  ).findOne({
    where: { countPlanId: countPlanId },
  });

  CountExecution.cache(`cache-execution-count-plan-${countPlanId}`).clear();

  const resp = await countExecution.update({
    status: "ended",
  });

  return resp;
}

module.exports = {
  dbCreateCountExecution,
  dbStopCountExecution,
  dbGetCountExecutionById,
  dbGetCountExecutions,
};
