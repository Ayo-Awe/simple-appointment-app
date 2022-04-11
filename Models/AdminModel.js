const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const AdminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

AdminSchema.pre("save", async function (next) {
  // hash password before storing in the db
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

AdminSchema.statics.AdminLogin = async function (username, password) {
  try {
    const user = await this.findOne({ username });
    // check if user exists and login user
    if (user) {
      const match = await bcrypt.compare(password, user.password); // returns true if they match
      // check if passwords match and return match
      if (match) {
        return match;
      } else {
        throw Error("Invalid password");
      }
    } else {
      throw Error("Invalid username");
    }
  } catch (error) {
    return error;
  }
};
module.exports = mongoose.model("Admin", AdminSchema);
