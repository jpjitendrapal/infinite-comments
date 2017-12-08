var PostObj = {};
function Comment(commentText, parent) {
    this.commentText = commentText;
    this.node = createCommentNode();
    this.textNode = this.node.getElementsByClassName('comment-text')[0];
    this.editNode = this.node.getElementsByClassName('comment-edit')[0];
    this.editInput = this.node.getElementsByClassName('comment-edit-input')[0];
    this.saveBtn = this.node.getElementsByClassName('comment-edit-save')[0];
    this.deleteBtn = this.node.getElementsByClassName('delete-btn')[0];
    this.replyBtn = this.node.getElementsByClassName('reply-btn')[0];
    this.commentSection = this.node.getElementsByClassName('child-comments')[0];
    this.textNode.appendChild(document.createTextNode(commentText));
    this.editInput.value = commentText;
    this.commentList = {};
    this.parent = parent;
    this.editNode.style.display = 'block';
    this.textNode.style.display = 'none';
    this.replyBtn.style.display = 'none';
    this.editInput.placeholder = 'Write comment here...';
    this.id = GlobalUtil.getNextCommentId();
    this.isNewCommentAllowed = true;
    this.node.setAttribute('comment-id', this.id);
    function createCommentNode() {
        var node = document.createElement('div');
        node.className = 'comment';
        
        node.innerHTML =
            '<div class="comment-text"></div>' +
            '<div class="comment-edit"><input class="comment-edit-input">' +
            '<button class="comment-edit-save">Save</button><button class="delete-btn">X</button></div>' +
            '<div class="reply-btn-ct"><span class="reply-btn btn-link">Reply</span></div>' +
            '<div class="child-comments"></div>'
            ;

        return node;
    }
    this.textNode.onclick = (function (comment) {
        return function () {
            comment.editNode.style.display = 'block';
            comment.textNode.style.display = 'none';
        }
    })(this);

    this.editInput.onkeyup = (function(comment){
        return function(evt){
            if(evt.keyCode == 13){
                var clkEvt = new Event('click');
                comment.saveBtn.dispatchEvent(clkEvt);
            }
        }
    })(this);

    this.saveBtn.onclick = (function (comment) {
        return function () {
            if(comment.editInput.value.trim().length == 0){
                return;
            }
            comment.textNode.innerText = comment.editInput.value;
            comment.editNode.style.display = 'none';
            comment.textNode.style.display = 'block';
            comment.replyBtn.style.display = 'block';
            comment.parent.isNewCommentAllowed = true;
        }
    }(this));

    this.replyBtn.onclick = (function(comment){
        return function(){
            if(comment.isNewCommentAllowed){
                var newComment = new Comment('', comment);
                comment.commentSection.appendChild(newComment.node);
                comment.commentList[newComment.id] = newComment;
                newComment.parent = comment;
                newComment.editInput.focus();
                comment.isNewCommentAllowed = false;
            }
        }
    }(this));

    this.deleteBtn.onclick = (function(comment){
        return function(){
            comment.parent.commentSection.removeChild(comment.node);
            delete comment.parent.commentList[comment.id];
            comment.parent.isNewCommentAllowed = true;
        }
    })(this);
}

var GlobalUtil = {
    commentId: 0,
    getNextCommentId: function(){
        return ("_"+ this.commentId++);
    }
}

function Post(postTitle) {
    this.postTitle = postTitle;
    this.commentList = {};
    this.node = createPostNode();
    this.commentSection = this.node.getElementsByClassName('comments')[0];
    this.postTitleNode = this.node.getElementsByClassName('post-title')[0];
    this.commentBtn = this.node.getElementsByClassName('post-comment')[0];
    this.postTitleNode.innerText = this.postTitle;
    this.isNewCommentAllowed = true;
    function createPostNode() {
        var node = document.createElement('div');
        node.className = 'post';
        node.innerHTML =
            '<div class="post-title"></div>' +
            '<div class="post-actions"> <span class="post-comment btn-link">Comment</span> </div>' +
            '<div class="comments"></div>'
            ;
        return node;
    }

    this.commentBtn.onclick = (function(post){
        return function(){
            if(!post.isNewCommentAllowed) { return }
            var comment = new Comment('', post);
            post.commentSection.appendChild(comment.node);
            post.commentList[comment.id] = comment;
            comment.parent = post;
            comment.editInput.focus();
            post.isNewCommentAllowed = false;
        }
    })(this);
}

document.body.onload = function () {
    var post = new Post("This is post, where you can comment and you can reply also");
    document.getElementById('main-body').appendChild(post.node);
    PostObj.post = post;
}

