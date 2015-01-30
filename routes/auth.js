var passport = require('passport');
var AuthController = {

    // Login a user 
    login: passport.authenticate('local', {
        successRedirect: '/auth/login/success',
        failureRedirect: '/auth/login/failure'
    }),

    // on Login Success callback
    loginSuccess: function(req, res){
        res.json({
            success: true,
            user: req.session.passport.user
        });
    },

    // on Login Failure callback
    loginFailure: function(req, res){
        res.json({
            success:false, 
            message: 'Invalid username or password.'
        });
    },

    // Log out a user   
    logout: function(req, res){
        req.logout();
        res.end();
    },

};

exports = module.exports = AuthController;