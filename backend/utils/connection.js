const mongoose = require("mongoose");


mongoose.connect(process.env.DB_URI)
.then(() => {
    console.log("db connected")
})
.catch((error) => {
    console.log("Error in db conn", error);
})