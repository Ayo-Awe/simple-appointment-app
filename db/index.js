const mongoose = require("mongoose");
require("dotenv").config();

/**
 *
 * @param {use} cb
 * specify a callback function cb
 *
 */
module.exports.ConfigureDB = (cb) => {
  mongoose.connect(process.env.DBURI).then((d) => {
    cb();
    console.log("Successfully connected to database...");
  });
};
