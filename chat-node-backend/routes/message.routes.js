module.exports = (app) => {
    const message = require('../controllers/message.controller.js');

    // Signup
    app.post('/message/list', message.getPreviousMsgs);
}