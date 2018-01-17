var authMiddleware = require('../app/Middleware/AuthMiddleware.js');
var messageController = require('../app/Controllers/Agent/MessageController.js');
var guestUserController = require('../app/Controllers/Agent/GuestUserController.js');

module.exports = function(app, passport) {
    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/login', (req, res) => {
        res.render('auth/login', {errorMessage: req.flash('loginMessage')});
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/support',
        failureRedirect : '/login',
        failureFlash : true
    }));

    app.get('/register', (req, res) => {
        res.render('auth/register', {errorMessage: req.flash('signupMessage')});
    });

    app.post('/register', passport.authenticate('register', {
        successRedirect : '/support',
        failureRedirect : '/register',
        failureFlash : true
    }));

    app.get('/support', authMiddleware, guestUserController.index);

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.get('/show-message-guest-user', messageController.index);
};

