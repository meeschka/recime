
const isOwner = (req, res, next) => {
    //if isowner, do next, else,  
    if(req.user.recipes.indexOf(req.params.id) >= 0) {
        next();
    } else res.redirect('back');
}
const isLoggedIn = (req, res, next) => {
    if(req.user) {
        next();
    } else res.redirect('/auth/google');
}

module.exports = {isLoggedIn, isOwner};