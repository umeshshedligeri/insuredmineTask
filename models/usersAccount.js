const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersAccountSchema = new Schema({
    account_name: {
        type: String,
    }
});

module.exports = useraccounts = mongoose.model('useraccounts', UsersAccountSchema);