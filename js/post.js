import { storageService } from "./storageService.js";

// Get post from localstorage with urlparam post id
document.addEventListener("DOMContentLoaded", () => {
  // Create a URLSearchParams object from the current URL
  const urlParams = new URLSearchParams(window.location.search);

  // Get the post ID from the URL parameters
  const postId = urlParams.get("id");
  const posts = storageService.loadData("posts");
  const post = posts.find((obj) => obj.id === parseInt(postId));
  console.log("loaded post with ID: " + post.id);
  renderPost(post);
});

function renderPost(post) {
  const mainContainer = document.getElementById("main-content");
  mainContainer.innerHTML = "";
  const articleElement = document.createElement("article");
  const users = storageService.loadData("users");
  const comments = storageService.loadData("comments");

  const postContainer = document.createElement("div");
  postContainer.classList.add("post-container");

  const postHeading = document.createElement("h3");
  postHeading.classList.add("post-heading");
  postHeading.innerText = post.title;

  const postTopContainer = document.createElement("div");
  postTopContainer.classList.add("post-top-container");

  const postContent = document.createElement("p");

  const postBottomContainer = document.createElement("div");
  postBottomContainer.classList.add("post-bottom-container");

  const tagsContainer = document.createElement("div");
  tagsContainer.classList.add("tags-container");

  const authorContainer = document.createElement("div");
  authorContainer.classList.add("author-container");

  const tags = [];
  for (const tag of post.tags) {
    const tagElement = document.createElement("div");
    tagElement.innerText = tag;
    tags.push(tagElement);
  }

  const authorContent = document.createElement("p");

  const reactionsContainer = document.createElement("div");
  reactionsContainer.classList.add("reactions-container");

  const upvoteButton = document.createElement("button");
  upvoteButton.classList.add("upvote-button");
  upvoteButton.classList.add("fa", "fa-thumbs-o-up");

  const reactionCounter = document.createElement("p");
  reactionCounter.classList.add("reaction-counter");
  const downvoteButton = document.createElement("button");

  downvoteButton.classList.add("downvote-button");
  downvoteButton.classList.add("fa", "fa-thumbs-o-down");

  const createCommentContainer = document.createElement("div");
  createCommentContainer.classList.add("create-comment-container");

  const commentTextArea = document.createElement("textarea");
  commentTextArea.classList.add("comment-text-area");
  commentTextArea.setAttribute("placeholder", "Create comment");
  commentTextArea.setAttribute("required", true);

  const createCommentBottomContainer = document.createElement("div");
  createCommentBottomContainer.classList.add("create-comment-bottom-container");

  const commentSelectUser = document.createElement("select");
  commentSelectUser.classList.add("comment-select-user");
  commentSelectUser.name = "users";

  const commentSelectUserLabel = document.createElement("label");
  commentSelectUserLabel.classList.add("comment-select-user-label");
  commentSelectUserLabel.for = "users";
  commentSelectUserLabel.innerText = "Select a user:";

  for (let user of users) {
    const option = document.createElement("option");
    option.value = user.id;
    option.innerText = user.username;
    commentSelectUser.append(option);
  }

  const createCommentButton = document.createElement("button");
  createCommentButton.classList.add("create-comment-button");
  createCommentButton.innerText = "Comment";

  const commentsContainer = document.createElement("article");
  commentsContainer.classList.add("comments-container");
  const commentHr = document.createElement("hr");
  commentHr.classList.add("comment-hr");

  for (let comment of comments) {
    if (post.id === comment.postId) {
      const commentContainer = document.createElement("div");
      const commentBody = document.createElement("p");
      const commentUser = document.createElement("p");

      commentBody.classList.add("comment-body");
      commentUser.classList.add("comment-user");
      commentContainer.classList.add("comment-container");

      commentBody.innerHTML = comment.body;
      commentUser.innerHTML = "user: " + comment.user.username;
      
      commentsContainer.append(commentContainer);
      commentContainer.append(commentBody);
      commentContainer.append(commentUser);

    }
  }

  mainContainer.append(articleElement);
  articleElement.append(postContainer);
  postContainer.append(postHeading);
  postContainer.append(postTopContainer);
  postTopContainer.append(postContent);
  postContent.innerText = post.body;

  postContainer.append(postBottomContainer);
  postBottomContainer.append(tagsContainer);
  tags.forEach((tag) => {
    tagsContainer.append(tag);
  });

  postBottomContainer.append(authorContainer);
  authorContainer.append(authorContent);
  const match = users.find((obj) => obj.id === post.userId);
  if (match) {
    authorContent.innerText = "user: " + match.username;
  }

  postContainer.append(reactionsContainer);
  reactionsContainer.append(upvoteButton);
  reactionsContainer.append(reactionCounter);
  reactionsContainer.append(downvoteButton);

  mainContainer.append(createCommentContainer);
  createCommentContainer.append(commentTextArea);
  createCommentContainer.append(createCommentBottomContainer);
  createCommentBottomContainer.append(commentSelectUserLabel);
  createCommentBottomContainer.append(commentSelectUser);
  createCommentBottomContainer.append(createCommentButton);
  
  mainContainer.append(commentHr);


  mainContainer.append(commentsContainer);

  

  upvoteButton.addEventListener("click", () => {
    // Update the post and get the updated version
    const updatedPost = storageService.updateArrayItem(
      "posts",
      post.id,
      (item) => {
        item.reactions.likes++;
      }
    );

    renderPost(updatedPost);
  });

  downvoteButton.addEventListener("click", () => {
    const updatedPost = storageService.updateArrayItem(
      "posts",
      post.id,
      (item) => {
        item.reactions.dislikes++;
      }
    );
    renderPost(updatedPost);
  });

  // upvoteButton.innerText = "fa fa-thumbs-o-up"
  const reactions = post.reactions.likes - post.reactions.dislikes;
  if (reactions < 0) {
    reactionCounter.style.color = "rgb(242, 43, 43)";
  } else {
    reactionCounter.style.color = "rgb(153, 255, 0)";
  }
  reactionCounter.innerText = reactions;

  createCommentButton.addEventListener("click", () => {
    const commentContent = commentTextArea.value;
    if (commentContent === '') {
      alert("Comment field cannot be empty");
      return;
    }
    let selectedUser = commentSelectUser.value;
    let commentId = 1;

    for (let user of users) {
      if (parseInt(selectedUser) === user.id) {
        selectedUser = user;
        // return;
      }
    }
    while (true) {
      if (!comments.find(obj => obj.id === commentId)) {
        console.log("break: " + commentId);
        break;
      }
      console.log(commentId);
      commentId ++;
    }

    storageService.saveData("comments", {
      id: commentId,
      body: commentContent,
      postId: post.id,
      user: { id: selectedUser.id, username: selectedUser.username },
    });
    console.log(selectedUser);
    console.log(commentContent);
    renderPost(post);
  });
}
