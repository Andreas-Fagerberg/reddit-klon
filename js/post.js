import { storageService } from "./storageService.js";

const mainContainer = document.getElementById("main-content");
// TODO: Get comments and user from localStorage.
// TODO: Render post.

// Get post from localstorage with urlparam post id
document.addEventListener("DOMContentLoaded", () => {
  // Create a URLSearchParams object from the current URL
  const urlParams = new URLSearchParams(window.location.search);

  // Get the post ID from the URL parameters
  const postId = urlParams.get("id");
  const posts = storageService.loadData("posts");
  const post = posts.find((obj) => obj.id === parseInt(postId));
  console.log("loaded post with ID: " + post.id);
  renderPost(post)

});

function renderPost(post) {
    const articleElement = document.createElement("article");
    articleElement.setAttribute("data-post-id", post.id);
    articleElement.setAttribute("role", "link");
    articleElement.addEventListener("click", (event) => {
      if (event.target.closest(".tags-container") || event.target.closest(".author-container")) {
        return;
      }
      // data-post-id gets converted to camelCase when it is accessd by dataset which means: data-post-id => postId. 
      // So we point to postId here in order to access the correct dataset.
      const postId = event.currentTarget.dataset.postId
      window.location.href = `post.html?id=${postId}`;
    })
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

    const upvoteButton = document.createElement("button");
    const downvoteButton = document.createElement("button");


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
}