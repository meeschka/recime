$('.totry-btn').on('click', function(e) {
    const recipeId = window.location.pathname.substr(9);
    const toTryBtn = $('.totry-btn')
    $.ajax({
        method: 'POST',
        url: `/api/recipes/${recipeId}/toggleToTry`,
        success: function(response) {
            toTryBtn.html(toTryBtn.html() === "Mark as 'To Try'" ? "Already In 'To Try'" : "Mark as 'To Try'");
            console.log(response);
            console.log('success!');
        },
        error: function(response) {
            console.log(response);
        }
    })
});