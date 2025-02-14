import { api } from "./apiClient.js"
import { User } from "./models/user.js"
import { Post } from "./models/post.js";
import { Comment } from "./models/comment.js";

const mainContainer = document.getElementById("main-content");

const users = [];
const comments = [];
const posts = [];
let number = 1;

function main() {
  api
    .getUsers()
    .then((response) => {
      response.users.forEach((userData) => {
        const user = new User(
          userData.id,
          userData.firstName,
          userData.lastName
        );
        console.log(user);
        users.push(user);
        renderPosts(user);
      });
      localStorage.setItem("users", JSON.stringify(users));
    })
    .catch((error) => {
      console.error("Error loading users:", error);
    });
  
  api.getPosts().then((response) => {
    let id = 1;
    response.posts.forEach((postData) => {
      const post = new Post(
        postData.id,
        postData.title,
        postData.body,
        postData.tags,
        postData.reactions,
        null,
        id,


    )
    id++;
    posts.push(post);

  });
  })
}

function renderPosts(user) {
  const postContainer = document.createElement("div");
  postContainer.classList.add("post-container");

  const postHeading = document.createElement("h3");
  postHeading.classList.add("post-heading");
  postHeading.innerText = posts[].title;
  

  const postTopContainer = document.createElement("div");
  postTopContainer.classList.add("post-top-container");

  const postContent = document.createElement("p");

  const postBottomContainer = document.createElement("div");
  postBottomContainer.classList.add("post-bottom-container");

  const tagsContainer = document.createElement("div");
  tagsContainer.classList.add("tags-container")

  const authorContainer = document.createElement("div");
  authorContainer.classList.add("author-container");

  const authorContent = document.createElement("p");
  

  const tags = [];
  for (let i = 0; i < 3; i++) {
    const tag = document.createElement("div");
    tag.innerText = "tag " + (i + 1);
    tags.push(tag);
  }

  mainContainer.append(postContainer);
  postContainer.append(postHeading);
  postContainer.append(postTopContainer);
  postTopContainer.append(postContent);
  postContent.innerText = "this is post number: " + number
  postContainer.append(postBottomContainer);
  postBottomContainer.append(tagsContainer);
  tags.forEach((tag) => {
    tagsContainer.append(tag);
  })

postBottomContainer.append(authorContainer);
authorContainer.append(authorContent);
authorContent.innerText = user.firstName;


  
  





  number++;
}

main();
