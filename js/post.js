import { storageService } from "./storageService.js";

// TODO: Get comments and user from localStorage.
// TODO: Render post.

// Get post from localstorage with urlparam post id
document.addEventListener("DOMContentLoaded", () => {
  // Create a URLSearchParams object from the current URL
  const urlParams = new URLSearchParams(window.location.search);

  // Get the post ID from the URL parameters
  const postId = urlParams.get("id");
  const posts = storageService.loadData("posts");
  const match = posts.find((obj) => obj.id === parseInt(postId));
  console.log(match);

});
