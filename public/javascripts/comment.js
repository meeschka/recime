const addComment = $('#add-comment')
const commentBox = $('#comment-box')
const editBtn = $('#edit-btn')
const cancelEditBtn = $('#cancel-edit-btn')
const editCommentForm = $('#edit-comment-form')
const commentText = $('#comment-text')
const cancelComment = $('#cancel-comment')

addComment.on('click', function(e){
    e.preventDefault();
    if (commentBox.css('display')==='none'){
        commentBox.css('display', 'block');
        addComment.html('Cancel')
    } else {
        commentBox.css('display', 'none');
        addComment.html('Add Comment');
    }
});

editBtn.on('click', function(e){
    editBtn.css('display', 'none');
    cancelEditBtn.css('display', 'inline-block');
    commentText.css('display', 'none');
    editCommentForm.css('display', 'inline-block');
})

cancelEditBtn.on('click', function(e){
    editBtn.css('display', 'inline-block');
    cancelEditBtn.css('display', 'none');
    commentText.css('display', 'inline-block');
    editCommentForm.css('display', 'none');
})

cancelComment.on('click', function(e){
    e.preventDefault();
    commentBox.css('display', 'none');
    addComment.html('Add Comment');
})