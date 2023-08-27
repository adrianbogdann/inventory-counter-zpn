const express = require("express");
const { addSubProduct } = require("../services/subProductService");
const { handleError } = require("../helpers/handleError");
const { dbGetSubProductById } = require("../repository/subProductRepository");
const { SUBPRODUCT_ROUTE } = require("../helpers/constants");
const { addSubProductValidationChain } = require("../helpers/validations");
const { validationResult } = require("express-validator");

const router = new express.Router();

/**
 * @param req {Object} - The Request
 * @param res {Object} - The response
 * @param req.body {Object} - JSON Payload
 * @param req.body.userId {String} - ID of the user making the API call
 * @param req.body.productId {String} - ID of the product you want to add
 * @param req.body.name {String} - Name of the product you want to add
 * @param {addSubProductValidationChain} middleware - Validator middleware.
 */
router.post(
  `${SUBPRODUCT_ROUTE}/add-subproduct`,
  addSubProductValidationChain(),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const addSubProductPayload = { ...req.body };
      const response = await addSubProduct(addSubProductPayload);

      res.status(200).json({ ok: true, data: response });
    } catch (err) {
      console.log(err);
      handleError(res, err);
    }
  }
);

// cache testing purposes
router.get(`${SUBPRODUCT_ROUTE}/get-subproduct/:id`, async (req, res) => {
  try {
    const { subProductId } = req.params;
    const response = await dbGetSubProductById(subProductId);

    res.status(200).json({ ok: true, data: response });
  } catch (err) {
    console.log(err);
    handleError(res, err);
  }
});

module.exports = router;
