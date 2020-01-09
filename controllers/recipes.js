const Recipe = require('../models/recipe')
const User = require('../models/user')
const multer = require('multer');
const cloudinary = require('cloudinary');
cloudinary.config({ 
    cloud_name: 'meeschka', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
const index = (req, res) => {
    Recipe.find({}).sort({'forks':-1})
    .then(recipes => {
        res.render('recipes/index', {
            title: 'Recipes',
            recipes,
            user: req.user
        })
    })
    .catch(err => {
        console.log(err);
        res.redirect('back')
    })
}
const show = (req, res) => {
    Recipe.findById(req.params.id)
        .populate('forks')
        .populate({path: 'comments.user'})
        .then(recipe => {
            console.log(recipe);
            res.render('recipes/show', {
                title: recipe.eventNames,
                recipe,
                user: req.user
            })
        })
        .catch(err => {
            console.log(err);
            res.redirect('/recipes');
        })
}
const newRecipe = (req, res) => {
    res.render('recipes/new', {
        title: 'New Recipe',
        user: req.user
    })
}
const create = async function(req, res) {
    let photo = `https://res.cloudinary.com/meeschka/image/upload/v1578446432/gjt4mikrmqujafdjpnud.gif`;
    let photoId = 1;
    if(req.file) {
        try {
            let result = await cloudinary.v2.uploader.upload(req.file.path, {quality: 'auto'});
            photo = result.secure_url;
            photoId = result.public_id;
        } catch(err) {
            console.log(err);
            return res.redirect("back");
        }
    }
    let tags = req.body.tags.split(',');
    tags.forEach(tag => {
        if (tag === '') tags.splice(tags.indexOf(tag), 1);
    })
        let recipe = new Recipe({
            name: req.body.name,
            photo: photo,
            photoId: photoId,
            ingredients: req.body.ingredients.filter(Boolean),
            directions: req.body.directions.filter(Boolean),
            notes: req.body.notes,
            tags: tags
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
}
const deleteRecipe = (req, res) => {
    //deletes recipes, removes recipe list from user list, removes recipe as a parent or fork from all other recipes
    let parent, forks;
    Recipe.findByIdAndDelete(req.params.id)
        .then(deletedRecipe => {
            parent = deletedRecipe.parentRecipe;
            forks = deletedRecipe.forks;
            deletedId = deletedRecipe._id;
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
                forks.forEach((fork)=>{
                    Recipe.findById(fork)
                        .then(recipe => {
                            //if deleted recipe had parent, make it the new parent
                            if (parent) {
                                recipe.parentRecipe = parent;
                                //need to add recipe as new child of parent
                                Recipe.findById(parent)
                                    .then(parentRecipe => {
                                        parentRecipe.forks.push(recipe._id);
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
const mine = (req, res, next) => {
    if(req.user) {
        User.findById(req.user._id).populate('recipes')
        .then (user => {
            res.render('recipes/index', {
                title: `${user.name}'s Recipes`,
                recipes: user.recipes,
                user: req.user
            })
        })
        .catch(err => {
            console.log(err);
            res.redirect('/recipes');
        })
    } else res.redirect('/auth/google')
}
const toTry = (req, res, next) => {
    if(req.user) {
        User.findById(req.user._id).populate('recipesToTry')
        .then (user => {
            res.render('recipes/index', {
                title: `${user.name}'s Recipes`,
                recipes: user.recipesToTry,
                user: req.user
            })
        })
        .catch(err => {
            console.log(err);
            res.redirect('/recipes');
        })
    } else res.redirect('/auth/google')
}
const edit = (req, res, next) => {
    Recipe.findById(req.params.id)
        .then(recipe => {
            res.render('recipes/edit', {
                title: `Edit ${recipe.name}`,
                recipe: recipe,
                user: req.user
            })
        })
        .catch(err => {
            console.log(err);
            res.redirect('back');
        })
}
const update = async function(req, res) {

    let newRecipe = {
        name: req.body.name,
        ingredients: Array.isArray(req.body.ingredients) ? req.body.ingredients.filter(Boolean) : req.body.ingredients,
        directions: Array.isArray(req.body.directions) ? req.body.directions.filter(Boolean) : req.body.directions,
        notes: req.body.notes,
        tags: req.body.tags.split(', '),
    }

    if(req.file) {
        try {
            let result = await cloudinary.v2.uploader.upload(req.file.path, {quality: 'auto'});
            newRecipe.photo = result.secure_url;
            newRecipe.photoId = result.public_id;
        } catch(err) {
            console.log(err);
            return res.redirect("back");
        }
    }
    Recipe.findByIdAndUpdate(req.params.id, newRecipe, {new: true})
        .then(recipe => {
            res.redirect(`/recipes/${recipe._id}`)
        }) 
        .catch(err => {
            console.log(err);
            res.redirect('back')
        })
}
const search = (req, res) => {
    let query = {}
    const val = req.query.name||req.params.query;
    query[req.params.type]= new RegExp(val, 'i');
    Recipe.find(query).sort({'forks':-1})
    .then(recipes => {
        res.render('recipes/index', {
            title: req.params.query,
            recipes: recipes,
            user: req.user
        })
    })
    .catch(err => {
        console.log(err);
        res.redirect('back');
    })
}

module.exports = {
    index,
    show,
    new: newRecipe,
    create,
    fork,
    delete: deleteRecipe,
    toTry,
    mine,
    edit,
    update,
    search
}