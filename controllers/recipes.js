const Recipe = require('../models/recipe')
const User = require('../models/user')

const index = (req, res) => {
    Recipe.find({}, function(err, recipes){
        res.render('recipes/index', {
            title: 'Recipes',
            recipes,
            user: req.user
        })
    })
}
const show = (req, res) => {
    Recipe.findById(req.params.id)
        .exec(function(err, recipe){
            res.render('recipes/show', {
                title: recipe.eventNames,
                recipe,
                user: req.user
            })
        })
}
const newRecipe = (req, res) => {
    res.render('recipes/new', {
        title: 'New Recipe',
        user: req.user
    })
}
const create = (req, res) => {
    let recipe = new Recipe({
        name: req.body.name,
        photo: req.body.photo,
        ingredients: req.body.ingredients.split('; '),
        directions: req.body.directions.split('; '),
        notes: req.body.notes,
        tags: req.body.tags.split('; '),
    })
    if (req.user) {
        User.findById(req.user._id, function(err, user){
            user.recipes.push(recipe._id);
            user.save(function(err) {
                console.log(user);
            })
        })
    }
    recipe.save(function(err) {
        if (err) return res.redirect('/recipes/new');
        console.log(recipe);
        res.redirect('/recipes')
    })
    //need to create new recipe
    //then add recipe to user object

}
const deleteRecipe = (req, res) => {
    //for delete, need to find all forks and fork parents and remove from those lists or handle gaps somehow
}

module.exports = {
    index,
    show,
    new: newRecipe,
    create,
    delete: deleteRecipe
}