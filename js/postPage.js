import { storageService } from "./storageService.js";
import { Comment } from "./models/comment.js";

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const posts = storageService.loadData("posts");
  const post = posts.find((obj) => obj.id === parseInt(postId));
  console.log("loaded post with ID: " + post.id);
  renderPost(post);
});

function renderPost(post) {
  const mainContainer = document.getElementById("main-content");
  mainContainer.innerHTML = "";
  
  const users = storageService.loadData("users");
  const comments = storageService.loadData("comments");
  
  // Create the post structure
  const articleElement = document.createElement("article");
  const postContainer = createPostContainer(post, users);
  
  // Add everything to the DOM
  mainContainer.append(articleElement);
  articleElement.append(postContainer);
  
  // Add comment section
  createCommentSection(users, comments, post, mainContainer);
}

function createPostContainer(post, users) {
  const postContainer = document.createElement("div");
  postContainer.classList.add("post-container");
  
  const postHeading = document.createElement("h3");
  postHeading.classList.add("post-heading");
  postHeading.innerText = post.title;
  postContainer.append(postHeading);
  
  const postTopContainer = createPostTopContainer(post);
  postContainer.append(postTopContainer);
  
  const postBottomContainer = createPostBottomContainer(post, users);
  postContainer.append(postBottomContainer);
  
  const reactionsContainer = createReactionsContainer(post);
  postContainer.append(reactionsContainer);
  
  return postContainer;
}

function createPostTopContainer(post) {
  const postTopContainer = document.createElement("div");
  postTopContainer.classList.add("post-top-container");
  
  const postContent = document.createElement("p");
  postContent.innerText = post.body;
  postTopContainer.append(postContent);
  
  return postTopContainer;
}

function createPostBottomContainer(post, users) {
  const postBottomContainer = document.createElement("div");
  postBottomContainer.classList.add("post-bottom-container");
  
  const tagsContainer = document.createElement("div");
  tagsContainer.classList.add("tags-container");
  postBottomContainer.append(tagsContainer);
  
  for (const tag of post.tags) {
    const tagElement = document.createElement("div");
    tagElement.innerText = tag;
    tagsContainer.append(tagElement);
  }
  
  const authorContainer = document.createElement("div");
  authorContainer.classList.add("author-container");
  postBottomContainer.append(authorContainer);
  
  const authorContent = document.createElement("p");
  authorContainer.append(authorContent);
  
  const match = users.find((obj) => obj.id === post.userId);
  if (match) {
    authorContent.innerText = "user: " + match.username;
  }
  
  return postBottomContainer;
}

function createReactionsContainer(post) {
  const reactionsContainer = document.createElement("div");
  reactionsContainer.classList.add("reactions-container");
  
  const upvoteButton = document.createElement("button");
  upvoteButton.classList.add("upvote-button", "fa", "fa-thumbs-o-up");
  reactionsContainer.append(upvoteButton);
  
  const reactionCounter = document.createElement("p");
  reactionCounter.classList.add("reaction-counter");
  reactionsContainer.append(reactionCounter);
  
  const downvoteButton = document.createElement("button");
  downvoteButton.classList.add("downvote-button", "fa", "fa-thumbs-o-down");
  reactionsContainer.append(downvoteButton);
  
  upvoteButton.addEventListener("click", () => {
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
  

  const reactions = post.reactions.likes - post.reactions.dislikes;
  reactionCounter.style.color = reactions < 0 ? "rgb(242, 43, 43)" : "rgb(153, 255, 0)";
  reactionCounter.innerText = reactions;
  
  return reactionsContainer;
}

function createCommentSection(users, comments, post, mainContainer) {

  const formContainer = document.createElement("div");
  formContainer.classList.add("create-comment-container");

  const commentTextArea = document.createElement("textarea");
  commentTextArea.classList.add("comment-text-area");
  commentTextArea.setAttribute("placeholder", "Create comment");
  commentTextArea.setAttribute("required", true);

  const formBottomContainer = document.createElement("div");
  formBottomContainer.classList.add("create-comment-bottom-container");

  const userSelect = document.createElement("select");
  userSelect.classList.add("comment-select-user");
  userSelect.name = "users";

  const userSelectLabel = document.createElement("label");
  userSelectLabel.classList.add("comment-select-user-label");
  userSelectLabel.for = "users";
  userSelectLabel.innerText = "Select a user:";

  for (let user of users) {
    const option = document.createElement("option");
    option.value = user.id;
    option.innerText = user.username;
    userSelect.append(option);
  }

  const submitButton = document.createElement("button");
  submitButton.classList.add("create-comment-button");
  submitButton.innerText = "Comment";

  formContainer.append(commentTextArea);
  formContainer.append(formBottomContainer);
  formBottomContainer.append(userSelectLabel);
  formBottomContainer.append(userSelect);
  formBottomContainer.append(submitButton);
  mainContainer.append(formContainer);


  const commentsContainer = document.createElement("article");
  commentsContainer.classList.add("comments-container");

  const divider = document.createElement("hr");
  divider.classList.add("comment-hr");


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

  submitButton.addEventListener("click", () => {
    const commentContent = commentTextArea.value;
    if (commentContent === "") {
      alert("Comment field cannot be empty");
      return;
    }
    let selectedUser = userSelect.value;
    let commentId = 1;

    for (let user of users) {
      if (parseInt(selectedUser) === user.id) {
        selectedUser = user;
      }
    }
    while (true) {
      if (!comments.find((obj) => obj.id === commentId)) {
        console.log("break: " + commentId);
        break;
      }
      console.log(commentId);
      commentId++;
    }

    storageService.saveData(
      "comments",
      new Comment(commentId, commentContent, post.id, {
        id: selectedUser.id,
        username: selectedUser.username,
      })
    );
    console.log(selectedUser);
    console.log(commentContent);
    renderPost(post);
  });

  mainContainer.append(divider);
  mainContainer.append(commentsContainer);

  return formContainer;
}
