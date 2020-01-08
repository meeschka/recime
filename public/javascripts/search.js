$('#search-btn').on('click', function(e){
    const searchRow = $('#search-row');
    if (searchRow.css('display')==='none'){
        $('#search-row').css('display', 'flex');
    } else $('#search-row').css('display', 'none');
})