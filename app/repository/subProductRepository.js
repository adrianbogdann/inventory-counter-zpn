const sequelize = require("sequelize");
const { Op } = sequelize;
const { SubProduct } = require("../models");

async function dbAddSubProduct(subProduct) {
  return SubProduct.cache().create({
    ...subProduct,
  });
}

async function dbGetSubProductById(subproductId) {
  return SubProduct.cache(`subproduct-${subproductId}`).findOne({
    where: {
      id: subproductId,
    },
  });
}

module.exports = { dbAddSubProduct, dbGetSubProductById };
