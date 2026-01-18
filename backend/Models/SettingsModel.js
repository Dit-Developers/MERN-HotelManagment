const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  defaultTaxPercentage: {
    type: Number,
    default: 0
  },
  defaultDiscountPercentage: {
    type: Number,
    default: 0
  }
});

const SettingsModel = mongoose.model('Settings', settingsSchema);
module.exports = SettingsModel;

