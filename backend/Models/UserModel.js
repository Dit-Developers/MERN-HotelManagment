const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

var userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "guest","receptionist", "manager", "staff"],
    default: "guest",
  },
  status:{
    type:String,
    enum:["active", "inactive","suspended"],
    default:"active"
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  var salt = await bcrypt.genSalt(10);
  var hashPassword = await bcrypt.hash(this.password, salt);
  this.password = hashPassword;
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

var userModel = mongoose.model("User", userSchema);
module.exports = userModel;
