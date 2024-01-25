const { DataTypes } = require("sequelize");
const connection = require("../utils/connection");

const Tweet = connection.define("Tweet", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  postID: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  vider :{
    type: DataTypes.TEXT,
    allowNull: true,
  }
  user_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
});

module.exports = Tweet;
