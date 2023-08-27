const sequelize = require("sequelize");
const { Op } = sequelize;
const { CountPlan } = require("../models");

async function dbBuildCountPlan(countPlan) {
  return CountPlan.cache().create({
    ...countPlan,
  });
}

async function dbGetCountPlanById(id) {
  //   return CountPlan.cache(`count-plan-${id}`).findOne({ - removed for testing purposes
  return CountPlan.cache(`countPlan-${id}`).findOne({
    query: { raw: true },
    where: { id },
  });
}

module.exports = { dbBuildCountPlan, dbGetCountPlanById };
