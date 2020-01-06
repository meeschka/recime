const express = require('express');
const router = express.Router();
const recipeCtrl = require('../controllers/recipes.js');

router.get('/', recipeCtrl.index);
router.post('/', recipeCtrl.create);
router.get('/new', recipeCtrl.new);
router.get('/:id', recipeCtrl.show);
router.post('/:id/fork', recipeCtrl.fork);
router.delete('/:id', recipeCtrl.delete);

module.exports = router;