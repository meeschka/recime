const express = require('express');
const router = express.Router();
const apiRecipeCtrl = require('../../controllers/api/recipes.js');
const auth = require('../../middleware/auth');

router.post('/:id/toggleToTry', apiRecipeCtrl.toggleToTry);
router.get('/:id/toTry', auth.isLoggedIn, apiRecipeCtrl.toTry);
module.exports = router;