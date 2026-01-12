const mongoose = require('mongoose');
const createDefaultAdmin = require('../utils/Admin');
mongoose.connect(process.env.MONGODB_URI).then(()=> {
    createDefaultAdmin();
    console.log("Database connected");
})