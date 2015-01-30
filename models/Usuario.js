var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    PassportLocalStrategy = require('passport-local').Strategy;

var schema = new mongoose.Schema({
	name: {type:String, required:true, trim:true},
    email: {type:String, required: true, trim: true, lowercase:true, unique: true},
    image: {type:String},
    password: {type:String, required: true },
    created: {type: Date, default: Date.now}
});

// This is your main login logic
schema.statics.localStrategy = new PassportLocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    },

    // @see https://github.com/jaredhanson/passport-local
    function (username, password, done){
        var User = require('./User');
        User.findOne({email: username}, function(err, user){
            if (err) { return done(err); }

            if (!user){
                return done(null, false, { message: 'User not found.'} );
            }
            if (!user.validPassword(password)){
                return done(null, false, { message: 'Incorrect password.'} );
            }

            // I'm specifying the fields that I want to save into the user's session
            // *I don't want to save the password in the session
            return done(null, {
                id: user._id,
                name: user.name,
                image: user.image,
                email: user.email,
            });
        });
    }
);

schema.methods.validPassword = function(password){
    if (this.password == password){
        return true;
    }

    return false;
}

schema.statics.serializeUser = function(user, done){
    done(null, user);
};

schema.statics.deserializeUser = function(obj, done){
    done(null, obj);
};


var Usuario = mongoose.model('Usuario', schema)

exports = module.exports = Usuario;