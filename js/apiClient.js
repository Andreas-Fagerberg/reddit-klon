class ApiClient {
    constructor() {
        this.BASE_URL = 'https://dummyjson.com';
    }

    async getPosts() {
        try {
            const response = await fetch(`${this.BASE_URL}/posts`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    }

    async getUsers() {
        try {
            const response = await fetch(`${this.BASE_URL}/users`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async getComments() {
        try {
            const response = await fetch(`${this.BASE_URL}/comments`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    }
}

export const api = new ApiClient();
api.getUsers().then(users => console.log(users));