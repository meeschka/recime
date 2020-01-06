const express = require('express');
const router = express.Router();
const recipeCtrl = require('../controllers/recipes.js');
const auth = require('../middleware/auth');

router.get('/', recipeCtrl.index);
router.post('/', recipeCtrl.create);
router.get('/new', recipeCtrl.new);
router.get('/myrecipes', recipeCtrl.mine);
router.get('/totry', recipeCtrl.toTry);
router.get('/:id', recipeCtrl.show);
router.post('/:id/fork', recipeCtrl.fork);
router.delete('/:id', auth.isLoggedIn, auth.isOwner, recipeCtrl.delete);

module.exports = router;