import { api } from "./apiClient.js";
import { User } from "./models/user.js";
import { Post } from "./models/post.js";
import { Comment } from "./models/comment.js";

const mainContainer = document.getElementById("main-content");

const comments = [];

let number = 1;

async function main() {
  const { posts, users, comments } = await api.getAllData();
  console.log({ posts, users, comments });
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

function createComment() {}


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
    const articleElement = document.createElement("article");
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
  }
}

main();
