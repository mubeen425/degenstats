const express = require("express");
const { Bxg_token, validateS } = require("../models/bxg_token");
const { Bxg_history } = require("../models/bxg_history");
const { Bonus_refer } = require("../models/bonus_refer");
const { BonusReferReward } = require("../models/bonus_refer_reward");
const { Op } = require("sequelize");
const router = express.Router();

router.get("/getall", async (req, res) => {
  try {
    const getHistory = await Bxg_token.findAll();

    return res.send(getHistory);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.get("/:wallet_address", async (req, res) => {
  try {
    if (!req.params.wallet_address)
      throw new Error("wallet address is missing.");
    const getAllRequestsByUserId = await Bxg_token.findOne({
      where: { wallet_address: req.params.wallet_address },
    });
    console.log("bsxt token here", getAllRequestsByUserId);
    if (!getAllRequestsByUserId) return res.send({});

    return res.send(getAllRequestsByUserId);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateS(req.body);
    if (error) throw new Error(error.details[0].message);

    const bxgt = await Bxg_token.findOne({
      where: { wallet_address: req.body.wallet_address },
    });
    console.log("bxt idhr hai bhai jan ", bxgt);
    if (!bxgt) {
      throw new Error("Bxg_token not found for the provided wallet address.");
    }

    const bonusrefer = await Bonus_refer.findOne({
      where: {
        wallet_address: req.body.wallet_address,
      },
    });

    if (req.body.bxg <= 0) {
      throw new Error("Invalid Bxg Amount");
    }
    req.body.bxg = parseFloat(req.body.bxg);

    if (bonusrefer?.isRefered) {
      const bxghist = await Bxg_history.findAll({
        where: {
          wallet_address: req.body.wallet_address,
          type: "Bought",
        },
      });

      if (bxghist.length === 0) {
        const calreward = req.body.usdt * 0.1;

        await BonusReferReward.create({
          wallet_address: req.body.wallet_address,
          refer_code: bonusrefer.refer_code,
          reward: calreward,
        });
      }
    }

    const updatedBxgBalance = bxgt.bxg + req.body.bxg;
    bxgt.bxg = updatedBxgBalance;
    await bxgt.save();
    req.body.type = "Bought";

    await Bxg_history.create(req.body);
    return res.send("Purchasing Successful.");
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
});

router.put("/", async (req, res) => {
  try {
    if (!req.body.bxg) throw new Error("Bxg value missing");
    const bxgt = await Bxg_token.findOne({
      where: { wallet_address: req.body.wallet_address },
    });
    if (!bxgt) throw new Error("Bxg not found.");
    let bxg = parseFloat(req.body.bxg);
    if (bxg <= 0 || bxg > bxgt.bxg) throw new Error("Invalid Bxg Value.");

    bxgt.bxg -= bxg;
    await bxgt.save();

    req.body.type = "pending";

    await Bxg_history.create(req.body);
    return res.status(200).send("Sold Successfuly.");
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!req.params.id) throw new Error("type value missing");
    if (!req.body.type || !req.body.blockhash)
      throw new Error("Type Or BlockHash Is Missing.");

    const bxghist = await Bxg_history.findOne({
      where: { id: req.params.id },
    });
    if (!bxghist) throw new Error("Invalid Data.");

    const bxgt = await Bxg_token.findOne({
      where: { wallet_address: bxghist.wallet_address },
    });

    if (!bxgt) throw new Error("Bxg not found.");

    bxghist.blockhash = req.body.blockhash;
    bxghist.type = req.body.type;
    // if (req.body.type == "sell_rejected") {
    //   bxgt.bxg += bxghist.bxg;
    //   await bxgt.save();
    // }
    await bxghist.save();
    return res.status(200).send("Sold Successfuly.");
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
});

module.exports = router;
