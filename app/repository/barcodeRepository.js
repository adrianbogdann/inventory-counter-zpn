const sequelize = require("sequelize");
const { Op } = sequelize;
const { Barcode, SubProduct } = require("../models");

async function dbAddBarcode(subProductId, value) {
  return Barcode.cache().create({
    subProductId,
    value,
  });
}

async function dbGetSubProductByBarcode(barcode) {
  const barcodeResp = await Barcode.cache(`barcode-${barcode}`).findOne({
    where: { value: barcode },
    query: { raw: true },
    include: [
      {
        model: SubProduct,
        as: "subProductOwner",
        attributes: ["id", "name", "productId"],
      },
    ],
  });

  return barcodeResp?.dataValues;
}

async function dbGetBarcodeByValue(value) {
  const barcodeResp = await Barcode.cache(`barcode-${value}`).findOne({
    where: { value },
    query: { raw: true },
  });

  return barcodeResp?.dataValues;
}

module.exports = {
  dbAddBarcode,
  dbGetSubProductByBarcode,
  dbGetBarcodeByValue,
};
