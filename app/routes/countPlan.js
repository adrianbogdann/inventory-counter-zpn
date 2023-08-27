const express = require("express");
const { validationResult } = require("express-validator");

const {
  buildCountPlan,
  startCountPlan,
} = require("../services/countPlanService");
const { handleError } = require("../helpers/handleError");
const { COUNT_PLAN_ROUTE } = require("../helpers/constants");
const {
  buildCountPlanChain,
  idParamValidationChain,
} = require("../helpers/validations");

const router = new express.Router();

/**
 * @param req {Object} - The Request
 * @param res {Object} - The response
 * @param req.body {Object} -JSON Payload
 * @param req.body.ownerId {String} - ID of the user who started the count plan
 * @param req.body.userId {String} - ID of the user making the API call
 * @param req.body.schedule {String} - either 'weekly' or 'monthly'
 * @param {buildCountPlanChain} middleware - Validator middleware.
 */
router.post(
  `${COUNT_PLAN_ROUTE}/build-countplan`,
  buildCountPlanChain(),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const buildCountPlanPayload = { ...req.body };
      const response = await buildCountPlan(buildCountPlanPayload);

      res.status(200).json({ ok: true, data: response });
    } catch (err) {
      console.log(err);
      handleError(res, err);
    }
  }
);

/**
 * @param req {Object} - The Request
 * @param res {Object} - The response
 * @param req.body {Object} - JSON Payload
 * @param req.body.userId {String} - ID of the user making the API call
 * @param req.params.id {String} - ID of the Count Plan you want a start a Count Execution for
 * @param {idParamValidationChain} middleware - Validator middleware.
 */
router.post(
  `${COUNT_PLAN_ROUTE}/start-countplan/:id`,
  // idParamValidationChain(),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const { id: countPlanId } = req.params;
      const response = await startCountPlan(countPlanId);

      // TODO: rework how we send responses to frontend
      res.status(200).json({ ok: true, data: response });
    } catch (err) {
      console.log(err);
      handleError(res, err);
    }
  }
);

module.exports = router;
