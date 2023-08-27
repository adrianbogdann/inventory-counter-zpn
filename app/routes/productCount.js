const express = require("express");
const { addProductCount } = require("../services/productCountService");
const { handleError } = require("../helpers/handleError");
const { PRODUCT_COUNT_ROUTE } = require("../helpers/constants");
const { addProductCountValidationChain } = require("../helpers/validations");
const { validationResult } = require("express-validator");

const router = new express.Router();

/**
 * @param req {Object} - The Request
 * @param res {Object} - The response
 * @param req.body {Object} - JSON Payload
 * @param req.body.userId {String} - ID of the user making the API call
 * @param req.body.barcode {String} - Barcode of the SubProduct
 * @param req.body.qty {String} - Qty of the Subproduct
 * @param req.body.CountExecutionId {String} - ID of the Count Execution you want to add the Product Count
 * @param req.body.CountPlanId {String} - ID of the Count Plan you want to add the Product Count
 * @param {addProductCountValidationChain} middleware - Validator middleware.
 */
router.post(
  `${PRODUCT_COUNT_ROUTE}/add-productcount`,
  addProductCountValidationChain(),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const addSubProductPayload = { ...req.body };
      const response = await addProductCount(addSubProductPayload);

      res.status(200).json({ ok: true, data: response });
    } catch (err) {
      console.log(err);
      handleError(res, err);
    }
  }
);

module.exports = router;
