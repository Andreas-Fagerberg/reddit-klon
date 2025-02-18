class ApiClient {
  constructor() {
    this.BASE_URL = "https://dummyjson.com";
    this.dataProperties = {
      users: "users",
      posts: "posts",
      comments: "comments",
    };
  }

  /* csutomTransform is used to filter out specific data, for example the user api contains 
    a large amount of unnecessary data and we only extract id and username with this "filter". */

  async fetchData(key, endpoint, customTransform = null) {
    const cachedData = localStorage.getItem(key);

    /* Checks if there is any data stored in localStorage and returns this data instead of the api call if 
     there is. */
    if (cachedData) return JSON.parse(cachedData);

    try {
      const response = await fetch(`${this.BASE_URL}/${endpoint}`);
      const rawData = await response.json();

      // Processes the data for data consistency and allows for using transformFn as a "filter".
      // All data is stored in an items array with the relevant key i.e. "users".
      // If there's a custom transform, use it on the raw data
      // Otherwise, use our standard data property extraction
      const processedData = customTransform
        ? customTransform(rawData)
        : rawData[this.dataProperties[key]];

      // localStorage.setItem(key, JSON.stringify(processedData));
      return processedData;
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      throw error;
    }
  }

  getPosts() {
    return this.fetchData("posts", "posts/?limit=10");
  }

  getUsers() {
    return this.fetchData("users", "users/?limit=0", (data) =>
      data.users.map((user) => ({
        id: user.id,
        username: user.username,
      }))
    );
  }
  

// /* getting posts by user with id 5 */
// fetch('https://dummyjson.com/posts/user/5')
// .then(res => res.json())
// .then(console.log);

  

  getComments() {
    return this.fetchData("comments", "comments/?limit=0");
  }

  async getAllData() {
    const [posts, users, comments] = await Promise.all([
      this.getPosts(),
      this.getUsers(),
      this.getComments(),
      
    ]);

    return { users, comments, posts };
  }
}

export const api = new ApiClient();
