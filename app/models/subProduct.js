"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SubProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SubProduct.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "productOwner",
      });

      SubProduct.hasMany(models.Barcode, {
        foreignKey: "subProductId",
        as: "barcodes",
      });

      SubProduct.hasMany(models.ProductCount, {
        foreignKey: "subProductId",
        as: "subProductCounts",
      });
    }
  }
  SubProduct.init(
    {
      name: DataTypes.STRING,
      productId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "SubProduct",
    }
  );
  return SubProduct;
};
