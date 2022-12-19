const mongoose = require("mongoose");


const User = mongoose.model("User", {
    
    passportID: {type: String, required: true, unique: true,},
    credit: {type: Number,required: true,default: 0,},
    cash: {type: Number,required: true,default: 0,}

  });


module.exports= User;