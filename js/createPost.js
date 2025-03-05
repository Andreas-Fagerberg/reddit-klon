import { storageService } from "./storageService.js";

export function createPost() {
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

}