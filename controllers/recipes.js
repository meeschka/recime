const Recipe = require('../models/recipe')
const User = require('../models/user')
const multer = require('multer');
const cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
        .populate('forks')
        .then(recipe => {
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
const create = (req, res) => {
    cloudinary.v2.uploader.upload(req.file.path, {quality: 'auto'}, function(result, err){
        if (err) {
            console.log(err);
        }
        let recipe = new Recipe({
            name: req.body.name,
            photo: result.secure_url,
            ingredients: req.body.ingredients.filter(Boolean),
            directions: req.body.directions.filter(Boolean),
            notes: req.body.notes,
            tags: req.body.tags.split(', '),
        })
        console.log(recipe); 
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
const update = (req, res, next) => {
    let newRecipe = {
        name: req.body.name,
        photo: req.body.photo,
        ingredients: req.body.ingredients.filter(Boolean),
        directions: req.body.directions.filter(Boolean),
        notes: req.body.notes,
        tags: req.body.tags.split(', '),
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

let storage = multer.diskStorage({
    filename: function(req, file, callback) {
      callback(null, Date.now() + file.originalname);
    }
  });
let imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
let upload = multer({ storage: storage, fileFilter: imageFilter})

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
    upload
}