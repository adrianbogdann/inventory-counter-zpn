const sequelize = require("sequelize");
const { Op } = sequelize;
const { ProductCount, SubProduct } = require("../models");

async function dbGetProductCounts() {
  return ProductCount.cache("product-counts").findAll({
    query: { raw: true },
  });
}

async function dbGetProductCountById(id) {
  return ProductCount.cache(`product-count-${id}`).findAll({
    where: { countPlanId: id },
    query: { raw: true },
  });
}

async function dbAddProductCount(productCount) {
  return ProductCount.cache().create({
    ...productCount,
  });
}

async function dbCheckIfSubproductQtyExists(
  subProductId,
  qty,
  CountExecutionId
) {
  const productCount = await ProductCount.cache(
    `subproduct-${subProductId}-countExecution-${CountExecutionId}-qty-${qty}`
  ).findOne({
    attributes: ["id", "qty"],
    where: {
      [Op.and]: {
        subProductId,
        qty: qty,
        CountExecutionId,
      },
    },
  });

  return productCount?.dataValues;
}

async function dbGetAllProductCountsByCountExecutionId(countExecutionId) {
  const productCounts = await ProductCount
    // .cache(
    // `productCounts-countExecution-${countExecutionId}`)
    .findAll({
      where: {
        CountExecutionId: countExecutionId,
      },
      include: [
        {
          model: SubProduct,
          as: "linkedSubProduct",
          attributes: ["name", "productId"],
        },
      ],
      raw: true,
    });

  return productCounts;
}

module.exports = {
  dbAddProductCount,
  dbGetProductCountById,
  dbGetProductCounts,
  dbCheckIfSubproductQtyExists,
  dbGetAllProductCountsByCountExecutionId,
};
