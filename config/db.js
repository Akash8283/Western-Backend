const mongoose = require('mongoose')

const dbString = process.env.MONGO_URI

mongoose.connect(dbString).then(res=>{
    console.log("DB connection successfull");
}).catch(err=>{
    console.log(err);
    console.log("DB connection error");
})