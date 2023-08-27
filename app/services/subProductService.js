const { dbAddSubProduct } = require("../repository/subProductRepository");
const { dbGetProductById } = require("../repository/productRepository");

async function addSubProduct(subProductData) {
  try {
    const { name, productId } = subProductData;
    const product = await dbGetProductById(productId);
    if (!product)
      throw new Error(
        "Subproduct does not have a valid parent product. Skipping..."
      );

    const addSubProductPayload = {
      name,
      productId,
    };

    const addSubProductResp = await dbAddSubProduct(addSubProductPayload);

    return addSubProductResp;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

module.exports = {
  addSubProduct,
};
