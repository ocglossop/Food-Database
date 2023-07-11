function Item(name, useBy = true, unit = '', qty = 0, added, expiry) {
    this.name = name; //The name of the food item
    this.qty = qty; //The amount of the item
    this.unit = unit; //The unit of the quantity
    this.useBy = useBy; //Whether or not the expiry date is a use by or best before. 'Use by' by default
    this.added = added; //The date the food was added
    this.expiry = expiry; //The expiry date of the food
}

//Opening the database
function openDB() {
    return new Promise((resolve, reject) => { //Creates a promise
        let db; //Database
        
        const openRequest = window.indexedDB.open("FoodDB", 1);
        
        openRequest.onerror = (event) => { //Function to call if the request returns an error
            console.error(`Request didn't work. Error code: ${event.target.errorCode}`);
            window.alert("Please check that IndexedDB is enabled for this website.");
            reject(event.target.errorCode); //The promise is rejected
        }
        openRequest.onsuccess = (event) => {
            db = event.target.result; //Stores the instance of the database
        
            //General error handler
            db.onerror = (event) => {
                console.error(`Error code: ${event.target.errorCode}`);
            }
            resolve(db); //The promise is fulfilled with the database instance
        }
        //Creating the database
        openRequest.onupgradeneeded = (event) => {
            db = event.target.result;
            //If I need to upgrade the database, I will change this section
            const foodStore = db.createObjectStore("foodStore", {autoIncrement: true});
            foodStore.transaction.oncomplete = (event) => {
                const foodStore = db.transaction("food", "readwrite").objectStore("food"); //Creates a transaction
                foodStore.add("test");
                console.log('data added');
            };
            const recipeStore = db.createObjectStore("recipeStore", {autoIncrement: true});
        
            const shoppingList = db.createObjectStore("shoppingList", {autoIncrement: true});
        }
    });
}

let dbPromise = openDB(); //The promise object is stored in the 'dbPromise' variable

//Reading data for a specific id
async function getItem(key, store, callback) { //Async function, as it may have to wait for the database to be opened
    let db = await dbPromise; //The database object is loaded when it is ready
    const objectStore = db.transaction(store, "readonly").objectStore(store); //Selects the object store
    const request = objectStore.get(key); //Selects the chosen key

    request.onsuccess = (event) => callback(event.target.result); //Calls the function specified 
    request.onerror = (event) => console.log(`getItem failed. Error code: ${event.target.errorCode}`);
    return
}
//Adding an item to an object store
async function addItem(item, store, callback = null) {
    let db = await dbPromise;
    const objectStore = db.transaction(store, "readwrite").objectStore(store);
    const request = objectStore.add(item);

    request.onsuccess = (event) => callback(event.target.result); //This will return the key of the item
    request.onerror = (event) => console.log(`addItem failed. Error code: ${event.target.errorCode}`);
    return
}
//Retrieveing all the items in the object store
async function getAllItems(store, callback) {
    let db = await dbPromise;
    const objectStore = db.transaction(store, "readonly").objectStore(store);
    const request = objectStore.getAll(); //Gets an array of all the items in the object store
    
    request.onsuccess = (event) => {callback(event.target.result)};
    request.onerror = (event) => console.log(`getAllItems failed. Error code: ${event.target.errorCode}`);
    return
}
//Updating an entry
async function updateItem(key, item, store, callback = null) {
    let db = await dbPromise;
    const objectStore = db.transaction(store, "readwrite").objectStore(store);
    const request = objectStore.put(item, key); //Puts the new item in at the specified key

    request.onsuccess = (event) => {callback(event.target.result)};
    request.onerror = (event) => console.log(`updateItem failed. Error code: ${event.target.errorCode}`);
}