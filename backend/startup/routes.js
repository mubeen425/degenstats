const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const web3loginRouter = require("../routes/Web3Login");
const bxgRouter = require("../routes/bxg_token");
const bxgHistoryRouter = require("../routes/bxg_history");
const stakeHistoryRouter = require("../routes/stake_history");
const stakeRouter = require("../routes/stake");
const referRouter = require("../routes/refer");
const bonusReferRouter = require("../routes/bonus_refer");
const bonusReferRewardRouter = require("../routes/bonus_refer_reward");
const stakeReferRewardRouter = require("../routes/stake_refer_reward");
const profileRouter = require("../routes/profile");
const IsUser = require("../middlewares/AuthMiddleware");
const passport = require("passport");
var config = require("../utils/twitterConfig");
const { TwitterApi } = require("twitter-api-v2");
const Tweet = require("../models/tweet");
const { v4: uuidv4 } = require("uuid");

const client = new TwitterApi(config);
//  const Client1 =new InstagramApi(config)
const bearer = new TwitterApi(
  "AAAAAAAAAAAAAAAAAAAAAL77owEAAAAAN%2BrJXg9jYkLr%2FpwkS8C%2Bgvu3ihI%3DAZMlsTEgoMiITQloi9Q2pCViJeb6p9HryhvtYdhh21BHblMExV"
);
const taskRoutes = require("../routes/Task");
const rewardBxg = require("../routes/reward_bxg");
const twitterClient = client.readWrite;
const twitterBearer = bearer.readOnly;

const cachedTweets = [];

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

module.exports = function (app) {
  app.use(
    session({
      secret: "something",
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("tiny"));
  app.get("/", async (req, res) => {
    res.send("working");
  });
  app.use("/user/login", web3loginRouter);
  app.use("/api/bonusrefer", bonusReferRouter);
  app.use("/api/refer", referRouter);
  app.use("/api/profile", profileRouter);

  app.use("/api/tasks", taskRoutes); // for task route

  app.get("/twitter/post/:text", async (req, res) => {
    await Tweet.create({
      id: uuidv4(),
      text: req.params.text,
    });
    res.redirect("/auth/twitter");
  });
  //posting data
  const CLIENT_KEY = 'awihir6m9psyg8re'; // Replace with your TikTok client key
const CLIENT_SECRET = 'CBIh8fViMoRgHxaMVNiVYJ1ZGC8tzeeC'; // Replace with your TikTok client secret
const REDIRECT_URI = 'https://127.0.0.1/auth/callback'; 
  
  app.get('/auth/callback', async (req, res) => {
    const { code, state } = req.query;
    const csrfState = req.cookies.csrfState;

    if (state !== csrfState) {
        return res.status(400).send('CSRF token mismatch');
    }

    const tokenUrl = 'https://open-api.tiktok.com/oauth/access_token';
    const formData = new URLSearchParams();
    formData.append('client_id', CLIENT_KEY);
    formData.append('client_secret', CLIENT_SECRET);
    formData.append('code', code);
    formData.append('redirect_uri', REDIRECT_URI);
    formData.append('grant_type', 'authorization_code');

    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch access token');
        }

        const data = await response.json();
        const accessToken = data.access_token;

        // Now you have the access token, you can use it to make TikTok API requests
        // You may want to save it to a user's session or database for future use

        res.send(`Access Token: ${accessToken}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting access token');
    }
});


  // -------------------------Tiktok testing here -----------------------

  app.get("/auth/twitter", passport.authenticate("twitter"));

  app.get(
    "/auth/twitter/callback",
    passport.authenticate("twitter", {
      successRedirect: "/profile",
      failureRedirect: "/auth/twitter",
    })
  );

  app.get('/oauth', (req, res) => {
    const csrfState = Math.random().toString(36).substring(2);
    res.cookie('csrfState', csrfState, { maxAge: 60000 });

    let url = 'https://www.tiktok.com/v2/auth/authorize/';
    url += `?client_key=${CLIENT_KEY}`;
    url += '&scope=user.info.basic';
    url += '&response_type=code';
    url += `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    url += '&state=' + csrfState;

    res.redirect(url);
});

  app.get("/auth/twitter", passport.authenticate("twitter"));

  app.get(
    "/auth/twitter/callback",
    passport.authenticate("twitter", {
      successRedirect: "/profile",
      failureRedirect: "/auth/twitter",
    })
  );

  app.get("/profile", async (req, res) => {
    if (req.isAuthenticated()) {
      try {
        const tweet = await Tweet.findOne({
          order: [["id", "DESC"]],
        });

        if (tweet) {
          const lastTweetContent = tweet.text;
          if (cachedTweets.includes(lastTweetContent)) {
            return res.redirect(
              "http://127.0.0.1:3000/complete-task?status=duplicate"
            );
          }
          cachedTweets.push(lastTweetContent);
          if (cachedTweets.length > 5) {
            cachedTweets.shift();
          }

          const response = await twitterClient.v2.tweet(lastTweetContent);
          console.log("Tweet posted successfully:", response.data.text);
          tweet.tweetID = response.data.id;
          tweet.text = response.data.text;
          await tweet.save();
          res.redirect("http://127.0.0.1:3000/complete-task?status=success");
        } else {
          res.redirect("http://127.0.0.1:3000/complete-task?status=no_tweet");
        }
      } catch (err) {
        console.error("Error posting tweet:", err);
        res.redirect(
          "http://127.0.0.1:3000/complete-task?status=" + err.message
        );
      }
    } else {
      res.status(401).send("Please login to post on Twitter.");
    }
  });

  app.use(IsUser);
  app.use("/api/bxg", bxgRouter);
  app.use("/api/rewardbxg", rewardBxg);

  app.use("/api/bxghistory", bxgHistoryRouter);
  app.use("/api/stake", stakeRouter);
  app.use("/api/stakehistory", stakeHistoryRouter);

  app.use("/api/bonusrefreward", bonusReferRewardRouter);
  app.use("/api/stakerefreward", stakeReferRewardRouter);
  app.use("/api/tasks", taskRoutes);
};
