const ethers = require("ethers");
const BitXSwap = require("../contractABI/BitXGoldSwap.json");
const axios = require("axios");
const config = require("config");

const Job = async () => {
  try {
    const { data } = await axios.get("https://www.goldapi.io/api/XAU/USD", {
      headers: {
        "x-access-token": config.get("G_Access_Token"),
        "Content-Type": "application/json",
      },
    });

    if (data) {
      const PRIVATE_KEY = config.get("W_PRIVATE_KEY");
      const provider = new ethers.providers.JsonRpcProvider(
        "https://bsc-dataseed.binance.org/"
      );
      const signer = new ethers.Wallet(PRIVATE_KEY, provider);
      const usdtBitXSwap = new ethers.Contract(
        BitXSwap.address,
        BitXSwap.abi,
        signer
      );
      let goldPrice = data["price_gram_24k"];
      goldPrice = goldPrice/10; // price of gold
      const ratio = ethers.utils.parseEther(goldPrice.toString());
      const swap = await (await usdtBitXSwap.changeRatio(ratio)).wait();
      console.log("gold value updated");
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = Job;
