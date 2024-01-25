const { DataTypes } = require("sequelize");
const connection = require("../utils/connection");
const moment = require("moment");
const Joi = require("joi");

const reward_bxg = connection.define(
  "reward_bxg",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    wallet_address: {
      type: DataTypes.STRING,
    },
    bxg: {
      type: DataTypes.FLOAT,
    },
  },
  {
    tableName: "reward_bxg",
    timestamps: false,
  }
);

function validateS(req) {
  const schema = Joi.object({
    wallet_address: Joi.required(),
    bxg: Joi.required(),
  });

  return schema.validate(req);
}

module.exports = {
    reward_bxg,
  validateS,
};
