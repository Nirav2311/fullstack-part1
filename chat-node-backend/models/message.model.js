const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    from: {
        type: String
    },
    username: {
        type: String
    },
    text: {
        type: String,
    },
    createdAt: {
        type: String,
    },
    likesFrom: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('Message', MessageSchema);