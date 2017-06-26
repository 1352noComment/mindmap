var User = require('../models/user');
var Profile = require('../models/profile');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myproject');


var profiles = [
new Profile({
  title: "Dark Souls 3 Video Game " ,
  description :" Awesome Game!!!!",
  accountname : "594f4c4456b7aa25ac80bbda"
}),
new Profile({
  title: "Minecraft " ,
  description :'Also awesome? ',
  accountname :"594f4c4456b7aa25ac80bbda"
}),
new Profile({
  title: "Minecraft Video Game" ,
  description :'Also awesome? But of course it was better in vanilla ...',
  accountname :"594f4c4456b7aa25ac80bbda"
})
];


var done = 0;
for (var i = 0; i < profiles.length; i++) {
    profiles[i].save(function(err, result) {
        done++;
        if (done === profiles.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
