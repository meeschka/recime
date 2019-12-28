const express = require('express');
const router = express.Router();
const recipeCtrl = require('../controllers/recipes.js');

router.get('/', recipeCtrl.index);

module.exports = router;