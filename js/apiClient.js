import { dataFilterService } from "./dataFilterService.js";
import { storageService } from "./storageService.js";

class ApiClient {
  constructor() {
    this.BASE_URL = "https://dummyjson.com";
    this.dataProperties = {
      posts: "posts",
      comments: "comments",
      users: "users",
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

      return processedData;
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      throw error;
    }
  }

  getPosts() {
    return this.fetchData("posts", "posts/?limit=10");
  }

  getComments() {
    return this.fetchData("comments", "comments/?limit=0");
  }

  getUsers() {
    return this.fetchData("users", "users/?limit=0&select=id,username");
  }

  async getAllData() {
    const [posts, comments, users] = await Promise.all([
      this.getPosts(),
      this.getComments(),
      this.getUsers(),
    ]);

    const filteredData = dataFilterService.filterRelevantData(
      posts,
      comments,
      users
    );

    // Pass an array of objects with keys and values
    storageService.saveData([
      { key: "posts", value: filteredData.posts },
      { key: "users", value: filteredData.users },
      { key: "comments", value: filteredData.comments },
    ]);

    return filteredData;
  }
}

export const api = new ApiClient();
