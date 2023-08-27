const express = require("express");
const {
  stopCountExecution,
  extractCountExecutionPrices,
} = require("../services/countExecutionService");
const { handleError } = require("../helpers/handleError");
const { COUNT_EXECUTION_ROUTE } = require("../helpers/constants");
const { idParamValidationChain } = require("../helpers/validations");
const { validationResult } = require("express-validator");

const router = new express.Router();

/**
 * @param req {Object} - The Request
 * @param res {Object} - The response
 * @param req.params.id {String} - Count Plan Id for the Count Execution you want to stop
 * @param req.body {Object} - JSON Payload
 * @param req.body.userId {String} - ID of the user making the API call
 * @param {idParamValidationChain} middleware - Validator middleware.
 */
router.post(
  `${COUNT_EXECUTION_ROUTE}/stop-countexecution/:id`,
  idParamValidationChain(),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const { id: countPlanId } = req.params;
      const response = await stopCountExecution(countPlanId);

      res.status(200).json({ ok: true, data: response });
    } catch (err) {
      console.log(err);
      handleError(res, err);
    }
  }
);

/**
 * @param req {Object} The Request
 * @param res {Object} The response
 * @param req.params.id {String} - Count Execution Id
 * @param req.body {Object} JSON Payload
 * @param req.body.userId {String} ID of the user making the API call
 * @param {idParamValidationChain} middleware - Validator middleware.
 */
router.get(
  `${COUNT_EXECUTION_ROUTE}/extract-prices/:id`,
  idParamValidationChain(),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const { id: countExecutionId } = req.params;

      const response = await extractCountExecutionPrices(countExecutionId);

      res.status(200).json({ ok: true, data: response });
    } catch (err) {
      handleError(res, err);
    }
  }
);

module.exports = router;
