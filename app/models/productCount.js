"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductCount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProductCount.belongsTo(models.SubProduct, {
        foreignKey: "subProductId",
        as: "linkedSubProduct",
      });
    }
  }
  ProductCount.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      subProductId: DataTypes.INTEGER,
      //   countPlanId: {
      //     type: DataTypes.INTEGER,
      //     references: {
      //       model: sequelize.models.CountPlan,
      //       key: "id",
      //     },
      //   },
      //   countExecutionId: {
      //     type: DataTypes.INTEGER,
      //     references: {
      //       model: sequelize.models.CountExecution,
      //       key: "id",
      //     },
      //   },
      qty: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ProductCount",
    }
  );
  return ProductCount;
};
