const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

let UserSchema = new Schema({
    username: {type: String, required: true, max: 100, unique: true, trim: true},
    password: {type: String, required: true},
    passwordConf: {type: String, required: true},
    dateCreated: {type: Date, required: true, default: Date.now },
}, {collection: 'users'});

UserSchema.statics.authenticate = function (username, password, callback) {
    this.findOne({username: username})
        .exec((err, user) => {
            if(err)
            {
                return callback(err);
            }
            else if(!user)
            {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function(err, result) {
                if(result === true)
                {
                    return callback(null, user);
                }
                else
                {
                    return callback();
                }
            })
        });
}

//TODO: add a pre function here that takes in a req.body and creates the proper user schema from it

//hash the password before saving
UserSchema.pre('save', function (next) {
    var user = this;
    console.log(user);
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        user.passwordConf = hash;
        next();
    });
});

module.exports = mongoose.model('User', UserSchema);