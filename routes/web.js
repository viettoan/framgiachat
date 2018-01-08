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

    app.get('/support', isLoggedIn, (req, res) => {
        res.render('agent/index');
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}