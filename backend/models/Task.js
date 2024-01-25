const { DataTypes } = require("sequelize");
const connection = require("../utils/connection");

const Joi = require("joi");

const Task = connection.define("Task", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  wallet_address: {
    type: DataTypes.STRING,
  },
  // wallet_address:0x93B261501412bFadF9E6Daa5fa977DA27FC133dd,
  task_title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  task_description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reward_amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  start_time_days: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  start_time_hours: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  start_time_minutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  should_tweet: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  should_insta: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  should_tiktok:{
  type: DataTypes.BOOLEAN,
  allowNull:false,
  },
  video: {
    type: DataTypes.STRING, // Assuming you store file paths or URLs
  },
  image: {
    type: DataTypes.STRING, // Assuming you store file paths or URLs
  },
  video_caption: {
    type: DataTypes.STRING, 
  },
  image_caption: {
    type: DataTypes.STRING, 
  },

},
{
  tableName: "Task",
  timestamps: true,
}

);


function validateS(req) {
  const schema = Joi.object({
    wallet_address: Joi.required(),
   
  
   
  });

  return schema.validate(req);
}


module.exports = {
  Task,
  validateS,

};


































// const { DataTypes } = require("sequelize");
// const connection = require("../utils/connection");
// const Tasks = connection.define("Task", {
        
//     id: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         primaryKey: true,
//       },
//       task_title:{
//         type: DataTypes.STRING,
//         allowNull: false,
//         primaryKey: true,
//       },
//       task_description:{
//         type: DataTypes.STRING,
//         allowNull: false,
//         primaryKey: true,
//       },  reward_amount:{
//         type: DataTypes.NUMBER,
//         allowNull: false,
//         primaryKey: true,
//       },  start_time_days:{
//         type: DataTypes.NUMBER,
//         allowNull: false,
//         primaryKey: true,
//       },  start_time_hours:{
//         type: DataTypes.NUMBER,
//         allowNull: false,
//         primaryKey: true,
//       },  start_time_minutes:{
//         type: DataTypes.NUMBER,
//         allowNull: false,
//         primaryKey: true,
//       },  should_tweet:{
//         type: DataTypes.Boolean,
//         allowNull: false,
//         primaryKey: true,
//       },  should_insta:{
//         type: DataTypes.Boolean,
//         allowNull: false,
//         primaryKey: true,
//       },
      
//        });
// export default  Tasks;

// /*  id: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     primaryKey: true,
//   },
//   tweetID: {
//     type: DataTypes.TEXT,
//     allowNull: true,
//   },
//   text: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
//   user_id: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   created_at: {
//     type: DataTypes.DATE,
//     allowNull: true,
//   },
//   deleted: {
//     type: DataTypes.BOOLEAN,
//     allowNull: true,
//     defaultValue: false,
//   }, */


