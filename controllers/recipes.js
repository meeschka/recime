const index = (req, res) => {
    res.render('recipes/index', {title: 'Recipes'})
}
module.exports = {
    index
}