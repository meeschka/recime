const express = require('express');
const router = express.Router();
const recipeCtrl = require('../controllers/recipes.js');
const auth = require('../middleware/auth');

router.get('/', recipeCtrl.index);
router.post('/', auth.isLoggedIn, recipeCtrl.create);
router.get('/new', auth.isLoggedIn, recipeCtrl.new);
router.get('/myrecipes', auth.isLoggedIn, recipeCtrl.mine);
router.get('/totry', auth.isLoggedIn, recipeCtrl.toTry);
router.get('/:id', recipeCtrl.show);
router.put('/:id', recipeCtrl.update);
router.post('/:id/fork', auth.isLoggedIn, recipeCtrl.fork);
router.get('/:id/edit', auth.isLoggedIn, auth.isOwner, recipeCtrl.edit);
router.delete('/:id', auth.isLoggedIn, auth.isOwner, recipeCtrl.delete);

module.exports = router;