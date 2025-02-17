import { api } from "./apiClient.js"
import { User } from "./models/user.js"
import { Post } from "./models/post.js";
import { Comment } from "./models/comment.js";

const mainContainer = document.getElementById("main-content");

const comments = [];

let number = 1;

async function main() {
  const { users, comments, posts } = await api.getAllData();
  console.log({ users, comments, posts });
  // saveDataLocalStorage("posts", users[1]);
  // api
  //   .getUsers()
  //   .then((response) => {
  //     response.users.forEach((userData) => {
  //       const user = new User(userData.id, userData.username);
  //       console.log(user);
  //       users.push(user);
  //     });
  //     localStorage.setItem("users", JSON.stringify(users));
  //   })
  //   .catch((error) => {
  //     console.error("Error loading users:", error);
  //   });
  // api.getPosts().then((response) => {
  //   let index = 0;
  //   response.posts.forEach((postData) => {
  //     const post = new Post(
  //       postData.id,
  //       postData.title,
  //       postData.body,
  //       postData.tags,
  //       postData.reactions,
  //       postData.comments,
  //       users[index].id
  //     );
  //     posts.push(post);
  //   });
  // });

  // for (let post of posts) {
  //   renderPosts();
  // }
  renderPosts(posts, users);
}

function createPost(title, body, tags, userId) {
  const posts = loadDataLocalStorage("posts");
  const post = new Post(
    posts.length,
    title,
    body,
    tags,
    { likes: 0, dislikes: 0 },
    [],
    userId
  );

  saveDataLocalStorage("posts", posts);
}

function updatePost(id, reaction = null, comment = null) {
  const posts = loadDataLocalStorage("posts");
  const post = posts[id];

  // TODO: Update post based on if reaction or comment is null.
  saveDataLocalStorage("posts", posts);
}

function createComment() {

}

function saveDataLocalStorage(key, data) {
  const dataCurrent = loadDataLocalStorage(key);
  dataCurrent.push(data);
  console.log(dataCurrent);
  localStorage.setItem(key, JSON.stringify(dataCurrent));
}

function loadDataLocalStorage(key) {
  const loadedData = localStorage.getItem(key);

  if (loadedData === null) {
    return [];
  }

  return JSON.parse(loadedData);
}
// function createUser(usersData) {
//   const tempUsers = usersData.users.map(userData =>
//     new User(
//       userData.id,
//       userData.username
//     )
//   );
//   console.log(tempUsers);
//   return tempUsers;
// }

// saveUser()

function renderPosts(posts, users) {
  for (const post of posts) {
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

    const authorContent = document.createElement("p");

    const tags = [];
    for (const tag of post.tags) {
      const tagElement = document.createElement("div");
      tagElement.innerText = tag;
      tags.push(tagElement);
    }

    mainContainer.append(postContainer);
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
    authorContent.innerText = user.username;

    number++;
  }
}

main();
