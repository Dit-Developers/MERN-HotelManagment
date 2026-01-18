const SettingsModel = require('../Models/SettingsModel');

const getSettings = async (req, res) => {
  try {
    let settings = await SettingsModel.findOne();
    if (!settings) {
      settings = await SettingsModel.create({});
    }
    return res.status(200).json({ message: "Settings loaded", settings });
  } catch (error) {
    console.error("Settings load error", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { defaultTaxPercentage, defaultDiscountPercentage } = req.body;
    let settings = await SettingsModel.findOne();
    if (!settings) {
      settings = new SettingsModel();
    }

    if (typeof defaultTaxPercentage === 'number') {
      settings.defaultTaxPercentage = defaultTaxPercentage;
    }
    if (typeof defaultDiscountPercentage === 'number') {
      settings.defaultDiscountPercentage = defaultDiscountPercentage;
    }

    const saved = await settings.save();
    return res.status(200).json({ message: "Settings updated", settings: saved });
  } catch (error) {
    console.error("Settings update error", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    console.log("New contact message received:", {
      name,
      email,
      phone,
      subject,
      message
    });

    return res.status(200).json({
      message: "Your message has been received. Our team will contact you soon."
    });
  } catch (error) {
    console.error("Contact form submission error", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { getSettings, updateSettings, submitContactMessage };
