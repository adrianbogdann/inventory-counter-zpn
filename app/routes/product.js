const express = require("express");
const { addProduct, assignSubproducts } = require("../services/productService");
const { handleError } = require("../helpers/handleError");
const { PRODUCT_ROUTE } = require("../helpers/constants");
const {
  addProductValidationChain,
  idParamValidationChain,
} = require("../helpers/validations");
const { validationResult } = require("express-validator");

const router = new express.Router();

/**
 * @param req {Object} - The Request
 * @param res {Object} - The response
 * @param req.body {Object} - JSON Payload
 * @param req.body.userId {String} - ID of the user making the API call
 * @param req.body.name {String} - Name of the product
 * @param req.body.category {String} - Category of the product
 * @param req.body.price {Number} - Price of the product
 * @param req.body.composedOf {Object} - Object describing the subproduct(s) that make the product
 * @param {addProductValidationChain} middleware - Validator middleware.
 */
router.post(
  `${PRODUCT_ROUTE}/add-product`,
  addProductValidationChain(),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const addProductPayload = { ...req.body };
      const response = await addProduct(addProductPayload);

      res.status(200).json({ ok: true, data: response });
    } catch (err) {
      handleError(res, err);
    }
  }
);

/**
 * @param req {Object} - The Request
 * @param res {Object} - The response
 * @param req.params.id {String} - ID of the Product you want to assign subproducts to
 * @param req.body {Object} - JSON Payload
 * @param req.body.userId {String} - ID of the user making the API call
 * @param req.body.composedOf {Object} - Object describing the subproduct(s) that make the product
 * @param {idParamValidationChain} middleware - Validator middleware.
 */
router.post(
  `${PRODUCT_ROUTE}/assign-subproducts/:id`,
  idParamValidationChain(),
  async (req, res) => {
    try {
      validationResult(req).throw();

      const { id } = req.params;
      const { composedOf } = req.body;
      const response = await assignSubproducts(id, composedOf);

      res.status(200).json({ ok: true, data: response });
    } catch (err) {
      handleError(res, err);
    }
  }
);

module.exports = router;
