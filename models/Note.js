const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    title : {
        type : String ,
        required : true
    },
    description : {
        type : String ,
        required : true
    },
    tag : {
        type : String ,
        default : "General"
    },
    date : {
        type : Date ,
        default : Date.now
    },
    color: {
        backgroundColor: {
            type: String,
            default: '#FFFFFF' // Default background color (white)
        },
        tagColor: {
            type: String,
            default: '#fb6c6c' // Default tag color (black)
        }
    }
});

module.exports = mongoose.model("note" , NotesSchema)