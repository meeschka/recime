const mongoose = require('mongoose');
const Recipe = require('../models/recipe')
mongoose.connect('mongodb://localhost/recipes',
    {useNewUrlParser: true,
    useUnifiedTopology: true}
)

let db = mongoose.connection;
db.on('connected', function(){
    console.log(`Connected to MongoDB at ${db.host}:${db.port}`);
    // const data = require('../data');
    // const recipeArray = data.recipes;
    // Recipe.create(recipeArray, function(err, recipes) {
    //     console.log(err);
    //     console.log(recipes);
    //     mongoose.connection.close();
    // });
});

module.exports = mongoose;
