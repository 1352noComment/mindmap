var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfileSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    mode :{type:Boolean , require : true},
     user: {type: Schema.Types.ObjectId, ref: 'User' } ,
     friends: [{ type : Schema.Types.ObjectId, ref: 'User' }]


});


var Profile = module.exports = mongoose.model('Profile', ProfileSchema);
