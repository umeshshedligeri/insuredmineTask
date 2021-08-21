const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LOBSchema = new Schema({
    category_name: {
        type: String,
    }
});

module.exports = lobs = mongoose.model('lobs', LOBSchema);