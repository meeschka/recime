const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    name: String,
    email: String,
    googleId: String,
    recipes: [{type: Schema.Types.ObjectId, ref: 'Recipe'}],
    recipesToTry: [{type: Schema.Types.ObjectId, ref: 'Recipe'}]
}, {
    timestamps: true
})
module.exports = mongoose.model('User', userSchema);