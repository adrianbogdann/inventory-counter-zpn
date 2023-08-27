const express = require("express");
const { handleError } = require("../helpers/handleError");
const { BARCODE_ROUTE } = require("../helpers/constants");
const { idParamValidationChain } = require("../helpers/validations");
const { addBarcode } = require("../services/barcodeService");
const { validationResult } = require("express-validator");

const router = new express.Router();

/**
 * @param req {Object} The Request
 * @param res {Object} The response
 * @param req.params.id {String} - Subproduct ID
 * @param req.body {Object} - JSON Payload
 * @param req.body.userId {String} - ID of the user making the API call
 * @param {idParamValidationChain} middleware - Validator middleware.
 */
router.post(
  `${BARCODE_ROUTE}/add-barcode/:id`,
  idParamValidationChain(),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const { id: subproductId } = req.params;
      const { value } = req.body;
      const response = await addBarcode(subproductId, value);

      res.status(200).json({ ok: true, data: response });
    } catch (err) {
      console.log(err);
      handleError(res, err);
    }
  }
);

module.exports = router;
