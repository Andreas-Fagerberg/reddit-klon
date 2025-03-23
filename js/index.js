import { api } from "./apiClient.js";
import { storageService } from "./storageService.js";
import { createPost } from "./createPost.js";

document.addEventListener("DOMContentLoaded", () => {
  const createPostButton = document.getElementById("nav-create-post-button");
  const createPostTitle = document.getElementById("create-post-title");
  const createPostTextArea = document.getElementById("create-post-text-area");
  const createPostSelectTag = document.getElementById("create-post-select-tags");
  const createPostTags = document.getElementById("selected-tags");
  const createPostSelectUser = document.getElementById("create-post-select-user")
  const createPostSubmitButton = document.getElementById(
    "create-post-submit-button"
  );
  const chosenTags = [];

  const modalBlur = document.createElement("div");
  modalBlur.classList.add("modal-blur");
  document.body.appendChild(modalBlur);

  // Open modal
  createPostButton.addEventListener("click", () => {
    document.body.classList.add("modal-open");
    createPostTextArea.value = "";
    createPostTitle.value = "";
    chosenTags.length = 0;
    createPostTags.innerHTML = ""
    createPostSelectTag.selectedIndex = 0;
    createPostSelectUser.selectedIndex = 0;
  });

  // Close modal when clicking overlay or potentially adding a close button
  modalBlur.addEventListener("click", (event) => {
    if (event.target === modalBlur) {
      document.body.classList.remove("modal-open");
    }
  });

  const closeModal = () => {
    document.body.classList.remove("modal-open");
  };

  const posts = storageService.loadData("posts");
  const tags = [];
  
  for (let post of posts) {
    tags.push(...post.tags);
  }
  const uniqueTags = [...new Set([...tags])];
  for (let tag of uniqueTags) {
    const tagOption = document.createElement("option");
    tagOption.value = tag;
    tagOption.innerText = tag;
    createPostSelectTag.append(tagOption);
  }

  const users = storageService.loadData("users");

  for (let user of users) {
    const option = document.createElement("option");
    option.value = user.id;
    option.innerText = user.username;
    createPostSelectUser.append(option);
  }

  createPostSelectTag.addEventListener("change", (event) => {
    event.stopPropagation();
    const tag = document.createElement("li");
    tag.classList.add("post-tag");
    if (!chosenTags.includes(createPostSelectTag.value) && chosenTags.length < 3) {
      const tagText = document.createElement("span");
      const removeIcon = document.createElement("span");
      const tagValue = createPostSelectTag.value;

      chosenTags.push(createPostSelectTag.value);

      tagText.classList.add("tag-text");
      tagText.textContent = createPostSelectTag.value;

      removeIcon.classList.add("remove-tag");
      removeIcon.textContent = "×";

      tag.appendChild(tagText);
      tag.appendChild(removeIcon);
      createPostTags.append(tag);
      tag.addEventListener("click", () => {
        // Remove from DOM
        tag.remove();
        // Remove from array
        const index = chosenTags.indexOf(tagValue); 
        if (index > -1) {
          chosenTags.splice(index, 1);
        }
      });
    }
  });

  // TODO: Implement create post functionality. Repurpose createcomment code.
  createPostSubmitButton.addEventListener("click", () => {
    const posts = storageService.loadData("posts");
    const postContent = createPostTextArea.value;
    const postTitle = createPostTitle.value;
    if (postContent === '') {
      alert("Post body cannot be empty");
      return;
    }
    if (postTitle === '') {
      alert("Post title cannot be empty");
      return;
    }

    let selectedUser = createPostSelectUser.value;
    let postId = 1;

    for (let user of users) {
      if (parseInt(selectedUser) === user.id) {
        selectedUser = user;
      }
    }
    while (true) {
      if (!posts.find(obj => obj.id === postId)) {
        console.log("break: " + postId);
        break;
      }
      console.log(postId);
      postId ++;
    }

    storageService.saveData("posts", {
      id: postId,
      title: postTitle,
      body: postContent,
      tags: chosenTags,
      reactions: { likes: 0, dislikes: 0},
      views: 0,
      userId: selectedUser.id,
    });
    console.log(selectedUser);
    console.log(postContent);
    renderPosts();
  });

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
  const reversedPosts = [...posts].reverse();

  for (const post of reversedPosts) {
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
      tagElement.classList.add("post-tag");
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
