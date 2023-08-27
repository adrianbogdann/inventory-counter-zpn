const { transformSubproductDTO } = require("../helpers/common");
const {
  dbAddProduct,
  dbAssignSubproducts,
  dbGetProductById,
  dbgGetProductByName,
} = require("../repository/productRepository");

async function addProduct(productData) {
  try {
    const { name, category, price, composedOf } = productData;

    const product = await dbgGetProductByName(name);
    console.log("product", product);

    if (product)
      throw new Error("There is already a product with that name. Skipping...");

    const addProductPayload = {
      name,
      category,
      price,
    };

    if (composedOf) {
      // transforms the composedOf column from subproduct barcodes to subproduct names
      const composedOfSubproductsObj = await transformSubproductDTO(composedOf);

      addProductPayload["composedOf"] = composedOfSubproductsObj;
    }

    const addProductResp = await dbAddProduct(addProductPayload);

    return addProductResp;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

async function assignSubproducts(productId, asignSubproductsPayload) {
  try {
    const product = dbGetProductById(productId);

    if (!product) throw new Error("Product does not exist. Skipping...");

    const composedOfSubproductsObj = await transformSubproductDTO(
      asignSubproductsPayload
    );

    const composedOf = JSON.stringify(composedOfSubproductsObj);

    const assignSubproducts = await dbAssignSubproducts(productId, composedOf);

    return assignSubproducts;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  addProduct,
  assignSubproducts,
};
