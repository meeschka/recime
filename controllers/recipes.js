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
                console.log(err);
            })
        })
    }
    recipe.save(function(err) {
        if (err) return res.redirect('/recipes/new');
        res.redirect('/recipes')
    })

}
const fork = (req, res) => {
    //orig recipe is in req.params.id
    Recipe.findById(req.params.id)
        .then(recipe=>{
            let newRecipe = new Recipe({
                name: recipe.name,
                photo: recipe.photo,
                ingredients: recipe.ingredients,
                directions: recipe.directions,
                notes: recipe.notes,
                tags: recipe.tags,
                parentRecipe: recipe._id
            });
            if (req.user) {
                User.findById(req.user._id, function(err, user){
                    user.recipes.push(newRecipe._id);
                    user.save(function(err) {
                        console.log(err);
                    })
                })
            }
            newRecipe.save(function(err) {
                if (err) return res.redirect(`/recipes/${newRecipe.parentRecipe}`);
            })
            return newRecipe;
        })
        .then((newRecipe)=>{
            Recipe.findById(newRecipe.parentRecipe, (err, recipe)=>{
                recipe.forks.push(newRecipe._id);
                recipe.save(function(err){
                    console.log(err)
                })
            })
            return newRecipe;
        })
        .then((newRecipe)=>{
            res.redirect(`/recipes/${newRecipe._id}`)
        })
        .catch((err)=>{
            console.log(err);
            res.redirect('/recipes');
        })
    //find recipe and copy to new recipe. add orig to parent.
    //add new recipe to forks in orig
    //add new recipe to parent user model
    //redirect to new recipe show page or old one?
}
const deleteRecipe = (req, res) => {
    //deletes recipes, removes recipe list from user list, removes recipe as a parent or fork from all other recipes
    let parent, forks;
    Recipe.findByIdAndDelete(req.params.id)
        .then(deletedRecipe => {
            parent = deletedRecipe.parentRecipe;
            forks = deletedRecipe.forks;
            deletedId = deletedRecipe._id;
            console.log(`parent recipe is ${parent}`);
            console.log(`forks are ${forks}`);
            console.log(`deletedRecipe is ${deletedRecipe}`);
        })
        .then(()=>{
            if (req.user) {
                User.findById(req.user._id, (err, user) => {
                    let index = user.recipes.indexOf(deletedId);
                    if (index) user.recipes.splice(index, 1);
                    user.save(function(err) {
                        console.log(err);
                    })
                })
            }
        })
        .then(()=>{
            if(parent) {
                Recipe.findById(parent)
                    .then(recipe =>{
                        let index = recipe.forks.indexOf(deletedId);
                        if (index) recipe.forks.splice(index, 1);
                        recipe.save(function(err){
                            console.log(err);
                        })
                    })
                    .catch(err =>{
                        console.log(err);
                    })
            }     
        })
        .then(()=>{
            if (forks) {
                console.log('entered forks loop');
                forks.forEach((fork)=>{
                    console.log(`for fork ${fork}`)
                    Recipe.findById(fork)
                        .then(recipe => {
                            console.log('found fork recipe')
                            console.log(recipe);
                            console.log(`new parent: ${parent}`)
                            //if deleted recipe had parent, make it the new parent
                            if (parent) {
                                recipe.parentRecipe = parent;
                                //need to add recipe as new child of parent
                                Recipe.findById(parent)
                                    .then(parentRecipe => {
                                        console.log(`parent recipe forks before were: ${parentRecipe.forks}`)
                                        parentRecipe.forks.push(recipe._id);
                                        console.log(`parent recipe forks are now: ${parentRecipe.forks}`)
                                        parentRecipe.save(function(err){
                                            console.log(err)
                                        })
                                    })
                                    .catch(err => {
                                        recipe.parentRecipe = '';
                                    })
                            } else recipe.parentRecipe = ''; 
                            recipe.save(function(err){
                                console.log(err);
                            })
                        })
                        .catch (err => {
                            console.log(err);
                        })
                })
            }
        })
        .then(()=>{
            res.redirect('/recipes')
        })
        .catch((err)=>{
            console.log(err);
            res.redirect('/recipes');
        })
}

module.exports = {
    index,
    show,
    new: newRecipe,
    create,
    fork,
    delete: deleteRecipe
}