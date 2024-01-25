const express = require("express");
const config = require("config");
const { BonusReferReward } = require("../models/bonus_refer_reward");

const router = express.Router();

router.get("/getall", async (req, res) => {
  try {
    const getHistory = await BonusReferReward.findAll();

    return res.send(getHistory);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.get("/:wallet_address", async (req, res) => {
  try {
    if (!req.params.wallet_address)
      throw new Error("wallet address is missing.");
    const getAllRequestsByUserId = await BonusReferReward.findAll({
      where: { refer_code: req.params.wallet_address },
    });

    return res.send(getAllRequestsByUserId);
  } catch (error) {
    return res.send({ message: error.message });
  }
});


module.exports = router;
