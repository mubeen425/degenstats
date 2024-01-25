const updateBxg = require("./startup/balanceUpdate");
const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("./utils/PassportTwitter"); // Import the passport configuration

const CronJob = require("cron").CronJob;
// const callbackURL= "http://127.0.0.1:3000/auth/instagram/callback"

app.use(
  session({
    secret: "something",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());


require("./startup/routes")(app);
require("./startup/db")();
require("./startup/cronshedule");
require("./startup/twitterRoutes");

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("listening on port" + port);
});

setInterval(() => {
  updateBxg();
}, 1000);

const cronTweet = new CronJob("30 * * * * *", async () => {});
