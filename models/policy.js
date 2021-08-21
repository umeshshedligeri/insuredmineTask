const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PloicySchema = new Schema({
    policy_number: {
        type: String
    },
    policy_start_date: {
        type: Date
    },
    policy_end_date: {
        type: Date
    },
    policy_category: {
        default: null,
        type: Schema.Types.ObjectId,
        ref: 'lobs'
    },
    collection_id: {
        type: String
    },
    company_collection_id: {
        default: null,
        type: Schema.Types.ObjectId,
        ref: 'carriers'
    },
    user_id: {
        default: null,
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = policy = mongoose.model('policy', PloicySchema);