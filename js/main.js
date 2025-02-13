import { api } from "./apiClient.js";
import { User } from "./user.js";
import { Post } from "./post.js";
import { Comment } from "./comment.js";

const users = [];
const comments = [];
const posts = [];

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
        users.push(user);
      });
    })
    .catch((error) => {
      console.error("Error loading users:", error);
    });
}

main();
