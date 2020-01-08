const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let commentSchema = new mongoose.Schema({
    comment: String
}, {
    timestamps: true
})

let recipeSchema = new mongoose.Schema({
    name: String,
    photo: String,
    photoId: String,
    ingredients: [String],
    directions: [String],
    notes: String,
    tags: [String],
    parentRecipe: {type: Schema.Types.ObjectId, ref: 'Recipe'},
    forks: [{type: Schema.Types.ObjectId, ref: 'Recipe'}],
    comments: [commentSchema],
}, {
    timestamps: true
})
module.exports = mongoose.model('Recipe', recipeSchema);