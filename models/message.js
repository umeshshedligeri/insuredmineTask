const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
    message: {
        type: String
    },
    day: {
        type: String
    },
    time: {
        type: String
    }
});

module.exports = messages = mongoose.model('messages', MessageSchema);