const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cron = require("node-cron");
var dbToucher = require('./db_toucher/db_toucher')

//remote server via mongo atlas
//mongoose.connect('mongodb+srv://kjsuarez:' + process.env.MONGO_ATLAS_PW + '@anothertextadventure-ddkor.mongodb.net/text-adventure-db?retryWrites=true')

//local server via $ mongod
// mongoose.connect(process.env.DATABASE_URL)
//
// .then(() => {
//     console.log("Connected to database!");
//   })
//   .catch(() => {
//     console.log("Connection failed!");
//   });


const rootRoute = require('./routes/app');
const appStoreRoutes = require('./routes/app_store_api');
const playStoreRoutes = require('./routes/play_store_api');
const reviewSaverRoutes = require('./routes/review_saver');

const app = express();

// Update existing db reviews every day at 8am
// cron.schedule("* 8 * * *", function() {
//   console.log("updating reviews:");
//   dbToucher.updateAll().then((result) => {
//     console.log(result);
//   }).catch(error => {
//     console.log(error);
//   });
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use('/', rootRoute);

app.use('/app-store-api', appStoreRoutes);
app.use('/play-store-api', playStoreRoutes);
// only need these when using server
// app.use('/review-saver', reviewSaverRoutes);

module.exports = app;
