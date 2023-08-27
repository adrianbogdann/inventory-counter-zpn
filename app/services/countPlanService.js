const {
  dbBuildCountPlan,
  dbGetCountPlanById,
} = require("../repository/countPlanRepository");
const { getUserById } = require("./userService");
const {
  checkIfTimeToStartCountExecution,
  isObjEmpty,
  generateCronString,
} = require("../helpers/common");
const {
  dbGetCountExecutionById,
  dbCreateCountExecution,
} = require("../repository/countExecutionRepository");

async function buildCountPlan(countPlanData) {
  try {
    const { ownerId, schedule } = countPlanData;
    if (!ownerId || !schedule) {
      throw new Error(
        "Some of the required fields are missing. Make sure the sub-product has a owner ID & schedule"
      );
    }

    const user = await getUserById(ownerId);
    if (!user) throw new Error("Owner ID does not exist. Skipping...");

    const cronString = generateCronString(schedule);

    const buildCountPlanPayload = {
      userId: ownerId,
      schedule: cronString,
    };

    const buildCountPlanResp = await dbBuildCountPlan(buildCountPlanPayload);

    return buildCountPlanResp;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

async function startCountPlan(countPlanId) {
  try {
    const countPlan = await dbGetCountPlanById(countPlanId);

    if (!countPlan) throw new Error("Count plan does not exist. Skipping...");

    const schedule = countPlan.schedule;

    // convert cron string to date, compare with current date
    const isTimeToStartCEFlag = checkIfTimeToStartCountExecution(schedule);

    if (isTimeToStartCEFlag) {
      const countExecution = await dbGetCountExecutionById(countPlanId);

      if (!countExecution) {
        const countExecution = await dbCreateCountExecution(countPlanId);
        if (countExecution)
          return { ok: true, data: "Count execution created" };
      } else {
        // if there is an already started count execution, skip
        throw new Error(
          "There is already a started count execution. Skipping..."
        );
      }
    }

    // if schedule does not match, then skip
    return {
      ok: true,
      data: "Can't start count execution because count plan schedule isn't matching with the current date",
    };
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

module.exports = {
  buildCountPlan,
  startCountPlan,
};
