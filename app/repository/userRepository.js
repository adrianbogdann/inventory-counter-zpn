const sequelize = require("sequelize");
const { Op } = sequelize;
const { User } = require("../models");

async function dbAddUser(userPayload) {
  return User.cache().create({
    ...userPayload,
  });
}

async function dbGetUsers() {
  return User.cache("active-users").findAll({
    attributes: ["name", "email", "role"],
  });
}

async function dbGetUserById(id) {
  return User.findOne({
    where: { id },
    query: { raw: true },
  });
}

module.exports = { dbGetUsers, dbGetUserById, dbAddUser };
