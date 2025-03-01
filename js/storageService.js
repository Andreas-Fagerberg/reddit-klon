class StorageService {
  // Load data from localStorage with default empty array
  loadData(key) {
    const loadedData = localStorage.getItem(key);
    if (loadedData === null) {
      return [];
    }
    return JSON.parse(loadedData);
  }

  // Save a collection of data items
  saveCollection(items) {
    // This preserves your existing API for the ApiClient
    items.forEach(item => {
      localStorage.setItem(item.key, JSON.stringify(item.value));
    });
  }

  // Save a single key-value pair
  saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Update an item in an array by ID. 
  // updateFn parameter lets us pass a "custom" function to use within the function.
  updateArrayItem(key, itemId, updateFn) {
    const array = this.loadData(key);
    const index = array.findIndex(item => item.id === itemId);
    
    if (index !== -1) {
      updateFn(array[index]);
      
      this.saveData(key, array);
      return array[index]; 
    }
    return null; 
  }
}

export const storageService = new StorageService();