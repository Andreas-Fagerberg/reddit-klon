import { api } from "./apiClient.js";
import { storageService } from "./storageService.js";
import { createPost } from "./createPost.js";


document.addEventListener("DOMContentLoaded", () => {
  const createPostButton = document.getElementById("nav-create-post-button");
  const createPostForm = document.getElementById("create-post-form");
  
  const modalBlur = document.createElement("div");
  modalBlur.classList.add("modal-blur");
  document.body.appendChild(modalBlur);

  // Open modal
  createPostButton.addEventListener("click", () => {
    document.body.classList.add("modal-open");
  });

  // Close modal when clicking overlay or potentially adding a close button
  modalBlur.addEventListener("click", (e) => {
    if (e.target === modalBlur) {
      document.body.classList.remove("modal-open");
    }
  });

  // Optional: Add close functionality to form
  const closeModal = () => {
    document.body.classList.remove("modal-open");
  };
  const tagSelector = document.getElementById("create-post-select-tags");
    const posts = storageService.loadData("posts");
    const tags = [];
    for (let post of posts) {
        tags.push(...post.tags);
    }
    const uniqueTags = [...new Set([...tags])];
    for (let tag of uniqueTags){
        const tagOption = document.createElement("option");
        tagOption.value = tag;
        tagOption.innerText = tag;
        tagSelector.append(tagOption);
    }

  // You might want to add a close button to your form HTML
  const closeButton = document.getElementById("close-post-form-button");
  closeButton.textContent = "×";
  closeButton.addEventListener("click", closeModal);
});

async function main() {
  const { posts, users, comments } = await api.getAllData();
  console.log({ posts, users, comments });

  renderPosts();
}

function renderPosts() {
  const mainContainer = document.getElementById("main-content");
  mainContainer.innerHTML = "";
  const posts = storageService.loadData("posts");
  const users = storageService.loadData("users");
  for (const post of posts) {
    const articleElement = document.createElement("article");
    articleElement.setAttribute("data-post-id", post.id);
    articleElement.setAttribute("role", "link");
    articleElement.addEventListener("click", (event) => {
      if (
        event.target.closest(".tags-container") ||
        event.target.closest(".author-container") ||
        event.target.closest(".reactions-container")
      ) {
        return;
      }
      // data-post-id gets converted to camelCase when it is accessd by dataset which means: data-post-id => postId.
      // So we point to postId here in order to access the correct dataset.
      const postId = event.currentTarget.dataset.postId;
      window.location.href = `post.html?id=${postId}`;
    });
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

    mainContainer.append(articleElement);
    articleElement.append(postContainer);
    postContainer.append(postHeading);
    postContainer.append(postTopContainer);
    postTopContainer.append(postContent);

    if (post.body.length > 60) {
      const text = post.body.substring(0, 57);
      if (text.endsWith(".") || text.endsWith(" ")) {
        postContent.innerText = text.substring(0, 56) + "...";
      } else {
        postContent.innerText = text + "...";
      }
    }
    post.body.length > 60 ? +"..." : post.body;

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

    upvoteButton.addEventListener("click", () => {
      // Update the post and get the updated version
      const updatedPost = storageService.updateArrayItem(
        "posts",
        post.id,
        (item) => {
          item.reactions.likes++;
        }
      );

      renderPosts();
    });

    downvoteButton.addEventListener("click", () => {
      const updatedPost = storageService.updateArrayItem(
        "posts",
        post.id,
        (item) => {
          item.reactions.dislikes++;
        }
      );
      renderPosts();
    });
    // upvoteButton.innerText = "fa fa-thumbs-o-up"
    const reactions = post.reactions.likes - post.reactions.dislikes;
    if (reactions < 0) {
      reactionCounter.style.color = "rgb(242, 43, 43)";
    } else {
      reactionCounter.style.color = "rgb(153, 255, 0)";
    }
    reactionCounter.innerText = reactions;
  }
}


main();
