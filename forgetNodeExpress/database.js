const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://ImenHT:Bac.20@cluster0.qjhwp.mongodb.net/TP")
.then(bd => console.log("database connected")) 
.catch(console.error());

