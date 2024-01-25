const express = require("express");
const { reward_bxg, validateS } = require("../models/reward_bxg");
const router = express.Router();

router.get("/getall", async (req, res) => {
  try {
    const getHistory = await reward_bxg.findAll();

    return res.send(getHistory);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.get("/:wallet_address", async (req, res) => {
  try {
    if (!req.params.wallet_address)
      throw new Error("wallet address is missing.");
    const getAllRequestsByUserId = await reward_bxg.findOne({
      where: { wallet_address: req.params.wallet_address },
    });
    console.log("bsxt token  reward token here", getAllRequestsByUserId);
    if (!getAllRequestsByUserId) return res.send({});

    return res.send(getAllRequestsByUserId);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const validationResult = validateS(req.body);
    if (validationResult) {
      return res.send({ status: false, message: validationResult.error });
    }

    const rewardToken = await reward_bxg.findOne({
      where: { wallet_address: req.body.wallet_address },
    });

    if (!rewardToken) {
      return res.send({
        status: false,
        message: "Reward token not found for the provided wallet address.",
      });
    }

    rewardToken.bxg += req.body.bxg;
    await rewardToken.save();

    return res.send("Reward added successfully.");
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
});

module.exports = router;
