const express = require("express");
const router = express.Router();
const { Task } = require("../models/Task");
const upload = require("../utils/fileUpload");
// Import multer configuration
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dbuuj0znt",
  api_key: "988563538528635",
  api_secret: "-v3YTxjqBUGYrF8IuFhCeXfFT-0",
});
router.post(
  "/addtask",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        task_title,
        task_description,
        video_caption,
        image_caption,
        reward_amount,
        start_time_days,
        start_time_hours,
        start_time_minutes,
        should_insta,
        should_tiktok,
        should_tweet,
        should_facebook, // New field
      } = req.body;

      const videoPath = req.files["video"] ? req.files["video"][0].path : null;
      const imagePath = req.files["image"] ? req.files["image"][0].path : null;

      console.log(videoPath);
      console.log(imagePath);

      const videoUrl = videoPath
        ? (await cloudinary.uploader.upload(videoPath)).secure_url
        : null;
      const imageUrl = imagePath
        ? (await cloudinary.uploader.upload(imagePath)).secure_url
        : null;
      const newTask = await Task.create({
        task_title,
        task_description,
        video: videoUrl,
        image: imageUrl,
        video_caption,
        image_caption,
        reward_amount,
        start_time_days,
        start_time_hours,
        start_time_minutes,
        should_insta,
        should_tiktok,
        should_tweet,
        should_facebook,
      });
      res.status(201).json(newTask);
    } catch (error) {
      console.error("Error creating task:", error.message);
      res.status(500).json({ error: "Error creating task" });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    console.error("Error while fetching tasks:", error.message);
    res.status(500).json({ error: "Error while fetching tasks" });
  }
});

router.get("/:wallet_address", async (req, res) => {
  try {
    if (!req.params.wallet_address)
      throw new Error("wallet address is missing.");
    const getAllRequestsByUserId = await Task.findOne({
      where: { wallet_address: req.params.wallet_address },
    });
    if (!getAllRequestsByUserId) return res.send({});

    return res.send(getAllRequestsByUserId);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const {Task} = require('../models/Task');

// //
// // const authenticate = require("../middlewares/AuthMiddleware");
// // Route for adding a new task
// // router.post("/api/tasks/addtask", authenticate, async (req, res) => {
// //   try {
// //     // Create a new task based on the request body
// //     const newTask = await Task.create(req.body);

// //     // Respond with the newly created task
// //     res.status(201).json(newTask);
// //   } catch (error) {
// //     console.error('Error creating task:', error);
// //     res.status(500).json({ error: 'Error creating task' });
// //   }
// // });

// // Change the route path to remove the leading /api
// router.post("/addtask", async (req, res) => {
//   console.log(req.body);
//   try {
//     // Create a new task based on the request body
//     const newTask = await Task.create(req.body);

//     // Respond with the newly created task
//     res.status(201).json(newTask);
//   } catch (error) {
//     console.error('Error creating task:', error.message);
//     res.status(500).json({ error: 'Error creating task' });
//   }
// });

// router.get("/:wallet_address", async (req, res) => {
//   try {
//     if (!req.params.wallet_address)
//       throw new Error("wallet address is missing.");
//     const getAllRequestsByUserId = await Task.findOne({
//       where: { wallet_address: req.params.wallet_address },
//     });
//     if (!getAllRequestsByUserId) return res.send({});

//     return res.send(getAllRequestsByUserId);
//   } catch (error) {
//     return res.send({ message: error.message });
//   }
// });

// module.exports = router;

// const express = require('express');
// const config = require("config");

// const router = express.Router();
// const Task = require('../models/Task');

// //  const authenticateJWT = require('../middlewares/AuthMiddleware');
// router.post("/addtask",  async (req, res) => {
//   try {
//     const newTask = await Task.create(req.body);
//     console.log("Task created:", newTask);
//     res.status(201).json(newTask);

//     const savedTask = await newTask.save();
//    // Respond with a success message or the saved task data
//      res.json(savedTask);
//   }

//   catch (error) {
//     console.error('Error creating task:', error);
//    res.status(500).json({ error: 'Error creating task' });
//   }

// });
// router.get('/', async (req, res) => {
//   try {
//     const tasks = await Task.findAll(); // Fetch tasks from your database
//     res.json(tasks); // Send the tasks as JSON response
//   } catch (error) {
//     console.error('Error while fetching tasks:', error);
//     res.status(500).json({ error: 'Error while fetching tasks' });
//   }
// });
// module.exports = router;

// Define a route to create a task
// router.post('/addtask', async (req, res) => {
//   try {
//     // Extract task data from the request body
//     const {
//       task_title,
//       task_description,
//       reward_amount,
//       start_time_days,
//       start_time_hours,
//       start_time_minutes,
//       should_tweet,
//       should_insta,
//     } = req.body;

//     // Create a new Task document
//     const newTask = new Task({
//       task_title,
//       task_description,
//       reward_amount,
//       start_time_days,
//       start_time_hours,
//       start_time_minutes,
//       should_tweet,
//       should_insta,
//     });

//     // Save the new task to the database
//     const savedTask = await newTask.save();

//     // Respond with a success message or the saved task data
//     res.json(savedTask);
//   } catch (error) {
//     console.error('Error creating task:', error);
//     res.status(500).json({ error: 'Error creating task' });
//   }
// });

/**
 
 
const bodyParser = require("body-parser");
// Assuming your Sequelize connection is in a 'utils' folder
const Task = require("./models/Task"); // Import the Task model

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Define routes for handling task creation
app.post("/api/tasks/addtask", async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    console.log("Task created:", newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Unable to create task" });
  }
  
});
 
  
 */

// const express = require('express');
// const router = express.Router();
// const Tasks = require('../models/Task');

// // Create a new task
// router.post('/addtask', async (req, res) => {
//   try {
//     const task = new Tasks(req.body);
//     await task.save();
//     res.status(201).json(task);
//   } catch (error) {
//     res.status(500).json({ error: 'Error creating task' });
//   }
// });

// router.get('/api/tasks', async (req, res) => {
//     try {
//       const tasks = await Tasks.find();
//       res.status(200).json(tasks);
//     } catch (error) {
//       console.error('Error while fetching tasks:', error);
//       res.status(500).json({ error: 'Error fetching tasks' });
//     }
//   });

// module.exports = router;

/**
 const express = require('express');
const config = require("config");
const ethers = require('ethers'); // Require ethers.js for wallet address verification

const router = express.Router();
const Task = require('../models/Task'); 

router.post("/addtask", async (req, res) => {
  try {
    // Get the signed message and wallet address from the request
    const { signedMessage, walletAddress, ...taskData } = req.body;

    // Verify the signature
    const isSignatureValid = verifySignature(signedMessage, walletAddress);

    if (isSignatureValid) {
      // Signature is valid, proceed to create the task
      const createdTask = await Task.create(taskData);
      console.log("Task created:", createdTask);
      res.status(201).json(createdTask);
    } else {
      // Invalid signature, deny access
      res.status(401).json({ error: 'Authentication failed' });
    }
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Error creating task' });
  }
});

// Function to verify the signature
function verifySignature(signedMessage, walletAddress) {
  // You'll need the user's public key for verification
  // This is a simplified example, and you may need to implement more security measures
  const publicKey = ethers.utils.recoverAddress(signedMessage);
  return publicKey.toLowerCase() === walletAddress.toLowerCase();
}

module.exports = router;

 */
