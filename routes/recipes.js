const express = require('express');
const router = express.Router();
const recipeCtrl = require('../controllers/recipes.js');
const auth = require('../middleware/auth');
const multer = require('multer');
let storage = multer.diskStorage({
    filename: function(req, file, callback) {
      callback(null, Date.now() + file.originalname);
    }
  });
let imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
let upload = multer({ storage: storage, fileFilter: imageFilter})


router.get('/', recipeCtrl.index);
router.post('/', auth.isLoggedIn, upload.single('image'), recipeCtrl.create);
router.get('/new', auth.isLoggedIn, recipeCtrl.new);
router.get('/myrecipes', auth.isLoggedIn, recipeCtrl.mine);
router.get('/totry', auth.isLoggedIn, recipeCtrl.toTry);
router.get('/:id', recipeCtrl.show);
router.put('/:id', recipeCtrl.update);
router.post('/:id/fork', auth.isLoggedIn, recipeCtrl.fork);
router.get('/:id/edit', auth.isLoggedIn, auth.isOwner, recipeCtrl.edit);
router.delete('/:id', auth.isLoggedIn, auth.isOwner, recipeCtrl.delete);

module.exports = router;