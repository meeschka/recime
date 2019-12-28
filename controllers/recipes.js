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

module.exports = {
    index
}