const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const appStoreRoutes = require('./routes/app_store_api');
const playStoreRoutes = require('./routes/play_store_api');

const app = express();

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

app.use('/app-store-api', appStoreRoutes);
app.use('/play-store-api', playStoreRoutes);

module.exports = app;
