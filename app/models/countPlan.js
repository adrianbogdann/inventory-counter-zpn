"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CountPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CountPlan.belongsTo(models.User, {
        foreignKey: "userId",
        as: "countPlanOwner",
      });

      CountPlan.hasMany(models.CountExecution, {
        foreignKey: "countPlanId",
        as: "countExecutions",
      });
      CountPlan.belongsToMany(models.CountExecution, {
        through: { model: models.ProductCount, unique: false },
      });
    }
  }
  CountPlan.init(
    {
      userId: DataTypes.INTEGER,
      schedule: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CountPlan",
    }
  );
  return CountPlan;
};
