var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../app/Models/User');
var date = require('date-and-time');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('register', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
        
            User.findOne({ 'email' :  email }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    if (password == req.body.passwordConfirm) {
                        let now = new Date();
                        var newUser = new User();
                        newUser.email    = email;
                        newUser.password = newUser.generateHash(password);
                        newUser.created_at = date.format(now, 'YYYY/MM/DD HH:mm:ss');
                        newUser.updated_at = date.format(now, 'YYYY/MM/DD HH:mm:ss');
                        newUser.save(function(err) {
                            if (err) {
                                throw err;
                            }
                                
                            return done(null, newUser);
                        });
                    } else {
                        return done(null, false, req.flash('signupMessage', 'Password miss match'));
                    }
                }

            });    

        });

    }));

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        User.findOne({ 'email' :  email }, function(err, user) {
            if (err) {
                return done(err);
            }
                
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }

            if (!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }
                
            return done(null, user);
        });

    }));

};
