const Recipe = require('../../models/recipe')
const User = require('../../models/user')

const toggleToTry = (req, res) => {
    //if user has marked recipe as to try, remove from list; else, add to list
    if(req.user) {
        User.findById(req.user._id)
            .then(user => {
                let index = user.recipesToTry.indexOf(req.params.id);
                console.log(`index is ${index}`)
                if (index >= 0) {
                    user.recipesToTry.splice(index, 1)
                    return user;
                } else {
                    user.recipesToTry.push(req.params.id);
                    return user;
                };
            })
            .then(user => {
                console.log(user);
                user.save(function(err){
                    if (err) {
                        console.log(err);
                    } else res.status(200).json(user);
                });
            })
            .catch(err => {
                res.status(500).json({error: err})
            })
    } else res.status(403).json({error: 'You must be logged in to add a recipe to try'})
}

module.exports = {
    toggleToTry
}