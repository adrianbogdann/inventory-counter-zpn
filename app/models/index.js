"use strict";

const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const dbConfig = require("../config/db.config.js")[env];

const Sequelize = require("sequelize");

const Redis = require("ioredis");
const RedisAdaptor = require("sequelize-transparent-cache-ioredis");
const sequelizeCache = require("sequelize-transparent-cache");

const redis = new Redis({
  showFriendlyErrorStack: true,
  host: "redis",
  port: 6379,
  // password: process.env.REDIS_PASS,
});

redis.on("error", function (err) {
  console.log("Redis error encountered", err);
});

redis.on("connect", function () {
  console.log("connected with redis");
});

const redisAdaptor = new RedisAdaptor({
  client: redis,
  namespace: "model",
  lifetime: 60 * 60,
});
const { withCache } = sequelizeCache(redisAdaptor);

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  // query: { raw: true },
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  // operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

// db.users = require("./user.js")(sequelize, Sequelize);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = withCache(model);
  });

Object.keys(db).forEach((modelName) => {
  console.log("modelName", db[modelName]);
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
