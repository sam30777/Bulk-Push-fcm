
const mongoose = require('mongoose');


   
let user  = new mongoose.Schema({
    deviceToken : { type : String}
})


let USER = mongoose.model('Users',user);

module.exports ={
    USER
}