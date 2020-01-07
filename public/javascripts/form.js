const addIng = $('#add-ingredients')
const addDir = $('#add-directions')
addIng.on('click', function(e){
    e.preventDefault();
    replicateField('ingredients').insertBefore(addIng);
});
addDir.on('click', function(e){
    e.preventDefault();
    replicateField('directions').insertBefore(addDir);
});
const replicateField = function(fieldType) {
    const originalInput = $(`input[name="${fieldType}"]`).first();
    let clonedInput = originalInput.clone();
    clonedInput.val('');
    return clonedInput;
}
