const Recipe = require('../models/recipe')

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
module.exports = {
    index,
    show
}