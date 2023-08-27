const {
  dbAddBarcode,
  dbGetBarcodeByValue,
} = require("../repository/barcodeRepository");
const { dbGetSubProductById } = require("../repository/subProductRepository");

async function addBarcode(subProductId, value) {
  try {
    const subProduct = await dbGetSubProductById(subProductId);

    if (!subProduct) throw new Error("Subproduct does not exist. Skipping...");

    const barcodeExists = await dbGetBarcodeByValue(value);

    if (barcodeExists) throw new Error("Barcode already exists. Skipping...");

    const barcode = await dbAddBarcode(subProductId, value);

    return barcode;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { addBarcode };
