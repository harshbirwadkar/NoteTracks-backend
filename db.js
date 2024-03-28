const mongoose = require('mongoose');

const mongoURI = process.env.NOTETRACK_APP_DATABASE

const connectToMongo = ()=>{
    mongoose.connect(mongoURI)
    .then(()=> {
        console.log("connected")
    }).catch((err)=>{
        console.log(err)
    })
}
module.exports = connectToMongo