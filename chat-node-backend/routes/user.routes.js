module.exports = (app) => {
    const user = require('../controllers/user.controller.js');

    // Signup
    app.post('/user/signup', user.signup);

    // Signin
    app.post('/user/signin', user.signin);

}