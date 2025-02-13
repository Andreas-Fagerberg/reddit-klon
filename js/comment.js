export class Comment {
    constructor(id, body, postId, likes, user) {
        this.id = id;
        this.body = body;
        this.postId = postId;
        this.likes = likes;
        this.user = user;
    }
}