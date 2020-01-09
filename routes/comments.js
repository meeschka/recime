const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentCtrl = require('../controllers/comments')

// router.get('/', commentCtrl.index);
router.post('/recipes/:id/comments', auth.isLoggedIn, commentCtrl.create);
router.put('/recipes/:recipeId/comments/:commentId', auth.isLoggedIn, commentCtrl.update);
router.delete('/recipes/:recipeId/comments/:commentId', auth.isLoggedIn, commentCtrl.delete);

module.exports = router;