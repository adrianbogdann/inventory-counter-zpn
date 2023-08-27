"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CountExecution extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      CountExecution.belongsTo(models.CountPlan, {
        foreignKey: "countPlanId",
        as: "countExecutionOwner",
      });

      CountExecution.belongsToMany(models.CountPlan, {
        through: { model: models.ProductCount, unique: false },
        // don't generate unique key in UPC
      });
    }
  }
  CountExecution.init(
    {
      status: DataTypes.ENUM(["started", "ended"]),
      countPlanId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CountExecution",
    }
  );
  return CountExecution;
};
