const mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
    comment: String
}, {
    timestamps: true
})

let recipeSchema = new mongoose.Schema({
    name: String,
    photo: String,
    ingredients: [String],
    directions: [String],
    notes: String,
    tags: [String],
    parentRecipe: String,
    forks: [String],
    comments: [commentSchema],
}, {
    timestamps: true
})
module.exports = mongoose.model('Recipe', recipeSchema);