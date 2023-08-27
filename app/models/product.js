"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.SubProduct, {
        foreignKey: "productId",
        as: "subProducts",
      });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      category: DataTypes.STRING(100),
      price: DataTypes.DECIMAL(6, 2).UNSIGNED,
      composedOf: {
        type: DataTypes.JSON,
        defaultValue: JSON.stringify({}),
        get() {
          return JSON.parse(this.getDataValue("composedOf"));
        },
        set(value) {
          return this.setDataValue("composedOf", JSON.stringify(value));
        },
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
