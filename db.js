const mongoose = require('mongoose');

// const mongoURI = "mongodb://localhost:27017/inotebook"
// const mongoURI = `mongodb+srv://harshbirwadkar3:<password>@cluster0.asga3ec.mongodb.net/`
const mongoURI = process.env.NOTETRACK_APP_DATABASE
// const mongoURI = `mongodb+srv://${process.env.NOTETRACK_APP_DATABASE_ID}:${process.env.NOTETRACK_APP_DATABASE_PASS}@cluster0.asga3ec.mongodb.net/inotebook`

const connectToMongo = ()=>{
    mongoose.connect(mongoURI)
    .then(()=> {
        console.log("connected")
    }).catch((err)=>{
        console.log(err)
    })
}
module.exports = connectToMongo