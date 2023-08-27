const sequelize = require("sequelize");
const { Op } = sequelize;
const { Product } = require("../models");

async function dbAddProduct(product) {
  return Product.cache().create({
    ...product,
  });
}

async function dbGetProductById(id) {
  return Product.cache(`product-${id}`).findOne({
    where: { id },
  });
}

async function dbgGetAllProducts() {
  return Product.findAll({
    raw: true,
    attributes: ["name", "category", "price", "composedOf"],
  });

  // return products.dataValue;
}

async function dbAssignSubproducts(productId, composedOf) {
  const product = await dbGetProductById(productId);

  await product.update({ composedOf });
  await product.save();

  return "Subproduct assign successful!";
}

async function dbgGetProductByName(name) {
  return Product.cache(`product-${name}`).findOne({
    attributes: ["name", "category", "price", "composedOf"],
    where: { name },
  });

  // return products.dataValue;
}

module.exports = {
  dbAddProduct,
  dbGetProductById,
  dbgGetAllProducts,
  dbAssignSubproducts,
  dbgGetProductByName,
};
