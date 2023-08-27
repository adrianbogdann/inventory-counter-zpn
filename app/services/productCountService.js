const { dbGetSubProductByBarcode } = require("../repository/barcodeRepository");
const {
  dbGetCountExecutionById,
} = require("../repository/countExecutionRepository");
const {
  dbGetProductCounts,
  dbAddProductCount,
  dbCheckIfSubproductQtyExists,
} = require("../repository/productCountRepository");

async function getProductCounts() {
  try {
    const productCounts = await dbGetProductCounts();
    return productCounts;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

async function getProductCountById(id) {
  try {
    const productCount = await dbGetUserById(id);

    return productCount;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

async function addProductCount(productCountData) {
  try {
    const { barcode, qty, CountExecutionId, CountPlanId } = productCountData;

    const subProduct = await dbGetSubProductByBarcode(barcode);
    if (!subProduct) throw new Error("Subproduct does not exist. Skipping...");

    const subProductId = subProduct.subProductId;

    const countExecution = await dbGetCountExecutionById(CountExecutionId);

    if (!countExecution) throw new Error("Count execution does not exist");

    // don't allow adding if count execution has ended
    if (countExecution.status === "ended")
      throw new Error(
        "Count execution has ended. Cannot add product counts. Skipping..."
      );

    // check if subproductId has another entry with the same qty
    const subProductQty = await dbCheckIfSubproductQtyExists(
      subProductId,
      qty,
      CountExecutionId
    );

    if (!subProductQty) {
      const productCountPayload = {
        subProductId,
        qty,
        CountExecutionId,
        CountPlanId,
      };
      const productCount = await dbAddProductCount(productCountPayload);

      return productCount;
    } else {
      throw new Error(
        "Cannot add same quantity for a subproduct twice. Skipping..."
      );
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

module.exports = {
  addProductCount,
  getProductCounts,
  getProductCountById,
};
