const {
  groupProductsByCategory,
  isObjEmpty,
  groupSubProductCounts,
  extractProductPrices,
} = require("../helpers/common");
const {
  dbStopCountExecution,
  dbGetCountExecutionById,
  dbGetCountExecutions,
} = require("../repository/countExecutionRepository");
const {
  dbGetAllProductCountsByCountExecutionId,
} = require("../repository/productCountRepository");
const { dbgGetAllProducts } = require("../repository/productRepository");

async function getCountExecutions() {
  try {
    const countExecutions = await dbGetCountExecutions();
    return countExecutions;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

async function getCountExecutionById(id) {
  try {
    const countExecution = await dbGetCountExecutionById(id);

    return countExecution;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

async function stopCountExecution(countPlanId) {
  try {
    const countExecution = await dbStopCountExecution(countPlanId);

    return countExecution;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

async function extractCountExecutionPrices(countExecutionId) {
  try {
    // extract all products and their composedOf, order it under Category
    const products = await dbgGetAllProducts();

    if (isObjEmpty(products))
      throw new Error("No products were found in the DB. Skipping...");

    const groupedProducts = groupProductsByCategory(products);

    const subProductCounts = await dbGetAllProductCountsByCountExecutionId(
      countExecutionId
    );

    // extract productCount data and group it by subproduct
    const groupedSubProductCounts = groupSubProductCounts(subProductCounts);

    // helper function to compute product products totalPrices based on totalSubproducts quantities (product->price)
    // + combined TotalPrices + category Prices
    const computePrices = extractProductPrices(
      groupedProducts,
      groupedSubProductCounts
    );

    return computePrices;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

module.exports = {
  stopCountExecution,
  getCountExecutions,
  getCountExecutionById,
  extractCountExecutionPrices,
};
