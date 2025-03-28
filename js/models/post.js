export class Post {
    constructor(id, title, body, tags, reactions, userId) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.tags = tags;
        this.reactions = reactions;
        this.userId = userId;
    }
}