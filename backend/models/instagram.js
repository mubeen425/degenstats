const { DataTypes } = require("sequelize");
const connection = require("../utils/connection");

const Instagram = connection.define("Instagram", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  InstaID: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  instatext: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
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
  },image: {
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  image_caption: {
    type: DataTypes.TEXT, 
    allowNull: true, 
  },
});

module.exports = Instagram;