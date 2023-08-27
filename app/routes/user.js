const express = require("express");
const { getUsers, getUserById, addUser } = require("../services/userService");
const { handleError } = require("../helpers/handleError");
const { USER_ROUTE } = require("../helpers/constants");
const { validationResult } = require("express-validator");
const { idParamValidationChain } = require("../helpers/validations");

const router = new express.Router();

/**
 * @param req {Object} - The Request
 * @param res {Object} - The response
 * @param req.body {Object} - JSON Payload
 * @param req.body.name {String} - Name of the user
 * @param req.body.email {String} - Email of the user
 * @param req.body.role {String} - Role of the user (admin, counter)
 */
router.post(`${USER_ROUTE}/add-user`, async (req, res) => {
  try {
    const userPayload = { ...req.body };
    const response = await addUser(userPayload);

    res.status(200).json({ ok: true, data: response });
  } catch (err) {
    handleError(res, err);
  }
});

/**
 * @param req {Object} - The Request
 * @param res {Object} - The response
 * @param req.body {Object} - JSON Payload
 * @param req.body.userId {String} - ID of the user making the API call
 */
router.get(`${USER_ROUTE}/get-users`, async (req, res) => {
  try {
    const response = await getUsers();

    res.status(200).json({ ok: true, data: response });
  } catch (err) {
    handleError(res, err);
  }
});

/**
 * @param req {Object} - The Request
 * @param res {Object} - The response
 * @param req.params.id {String} - User ID
 * @param req.body {Object} - JSON Payload
 * @param req.body.userId {String} - ID of the user making the API call
 */
router.get(
  `${USER_ROUTE}/get-user/:id`,
  idParamValidationChain(),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const { id } = req.params;
      const response = await getUserById(id);

      res.status(200).json({ ok: true, data: response });
    } catch (err) {
      handleError(res, err);
    }
  }
);

module.exports = router;
