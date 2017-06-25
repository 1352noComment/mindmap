var User = require('../models/user');
var Account = require('../models/account');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myproject');


var accounts = [
new Account({
  title: "File 2" ,
  description :"for info",
}),

new Account({
  title: "File 3" ,
  description :"for info and filing",
})
];

var done = 0;
for (var i = 0; i < accounts.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if (done === accounts.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
