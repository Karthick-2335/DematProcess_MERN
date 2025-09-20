import mongoose from 'mongoose'

const testScheme = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    }
},{timestamps : true})


const Test = mongoose.model('Test',testScheme);

export default Test;