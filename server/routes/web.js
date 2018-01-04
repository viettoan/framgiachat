module.exports = function(app) {
    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/login', (req, res) => {
        res.render('auth/login');
    });

    app.get('/register', (req, res) => {
        res.render('auth/register');
    });

    app.get('/support', (req, res) => {
        res.render('agent/index');
    });
};