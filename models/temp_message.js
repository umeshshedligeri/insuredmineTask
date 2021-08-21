const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TempMessageSchema = new Schema({
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

module.exports = temp_messages = mongoose.model('temp_messages', TempMessageSchema);