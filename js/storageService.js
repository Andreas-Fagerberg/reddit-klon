class StorageService {
  saveData(items) {
    // Expect array of objects with key and value properties
    items.forEach(item => {
      localStorage.setItem(item.key, JSON.stringify(item.value));
    });
  }

  loadData(key) {
    const loadedData = localStorage.getItem(key);
    if (loadedData === null) {
      return [];
    }
    return JSON.parse(loadedData);
  }
}

export const storageService = new StorageService();

// function (key, data) {
//     const dataCurrent = loadDataLocalStorage(key);
//     dataCurrent.push(data);
//     console.log(dataCurrent);
//     localStorage.setItem(key, JSON.stringify(dataCurrent));
//   }
