const { body, param } = require("express-validator");

const buildCountPlanChain = () => [
  body("ownerId").exists().isNumeric().trim().escape(),
  body("userId").exists().isNumeric().trim().escape(),
  body("schedule")
    .isIn(["weekly", "monthly"])
    .withMessage('Schedule has to be only "weekly" or "monthly"'),
];

const addProductValidationChain = () => [
  body("name").exists().trim().escape(),
  body("category").exists().trim().escape(),
  body("price").exists().isFloat().trim(),
  // body("composedOf").exists().isObject(),
];

const idParamValidationChain = () =>
  param("id")
    .exists()
    .isNumeric()
    .withMessage("The id has to be a numeric value")
    .trim()
    .escape();

const addProductCountValidationChain = () => [
  body("barcode").exists().isAlphanumeric().trim(),
  body("qty").exists().isNumeric().trim(),
  body("CountExecutionId").exists().isNumeric().trim(),
  body("CountPlanId").exists().isNumeric().trim(),
];

const addSubProductValidationChain = () => [
  body("productId").exists().isNumeric().trim(),
  body("name").exists().isAlpha().trim().escape(),
  body("userId").exists().isNumeric().trim(),
];

module.exports = {
  buildCountPlanChain,
  idParamValidationChain,
  addProductValidationChain,
  addProductCountValidationChain,
  addSubProductValidationChain,
};
