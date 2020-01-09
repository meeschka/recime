$('#search-btn').on('click', function(e){
    const searchRow = $('#search-row');
    if (searchRow.css('display')==='none'){
        searchRow.css('display', 'flex');
    } else searchRow.css('display', 'none');
})