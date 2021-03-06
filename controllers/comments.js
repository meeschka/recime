const Recipe = require('../models/recipe')
const User = require('../models/user')

const create = (req, res) => {
    Recipe.findById(req.params.id)
        .then(recipe => {
            req.body.user = req.user._id;
            recipe.comments.push(req.body);
            recipe.save(function(err) {
                if (err) res.redirect('back');
                res.redirect(`/recipes/${recipe._id}`)
            })
        })
        .catch(err=> {
            console.log(err);
            res.redirect('back')
        })
}
const update = (req, res) => {
    Recipe.findOneAndUpdate({'_id' : req.params.recipeId, 'comments._id' : req.params.commentId},
    {
        '$set': {'comments.$.comment' : req.body.comment}
    }, {new: true})
    .then(recipe => {
        res.redirect(`/recipes/${recipe._id}`)
    })
    .catch(err => {
        console.log(err);
        res.redirect('back');
    })
}
const deleteComment = (req, res) => {
    Recipe.findByIdAndUpdate(req.params.recipeId, {$pull: {comments: {_id : req.params.commentId}}}, {new: true}, function (err, recipe){
        if (err) {
            res.redirect('back');
        }
        res.redirect(`/recipes/${recipe._id}`)
    })
}

module.exports = {
    create,
    update,
    delete: deleteComment
}