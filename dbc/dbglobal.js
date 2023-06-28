function Item(name, useBy = true, unit = '', qty = 0, added, expiry) {
    this.name = name; //The name of the food item
    this.qty = qty; //The amount of the item
    this.unit = unit; //The unit of the quantity
    this.useBy = useBy; //Whether or not the expiry date is a use by or best before. 'Use by' by default
    this.added = added; //The date the food was added
    this.expiry = expiry; //The expiry date of the food
}

//Opening the database
let db; //Database
let dbReady = false;

const openRequest = window.indexedDB.open("FoodDB", 1);

openRequest.onerror = (event) => { //Function to call if the request returns an error
    console.error(`Request didn't work. Error code: ${event.target.errorCode}`);
    window.alert("Please check that IndexedDB is enabled for this website.");
}
openRequest.onsuccess = (event) => {
    db = event.target.result; //Stores the instance of the database

    //General error handler
    db.onerror = (event) => {
        console.error(`Error code: ${event.target.errorCode}`);
    }
    dbReady = true; //Mark that the database is ready to use
}
//Creating the database
openRequest.onupgradeneeded = (event) => {
    db = event.target.result;
    //If I need to upgrade the database, I will change this section
    const foodStore = db.createObjectStore("foodStore", {autoIncrement: true});
    
    const recipeStore = db.createObjectStore("recipeStore", {autoIncrement: true});

    const shoppingList = db.createObjectStore("shoppingList", {autoIncrement: true});

}

//Reading data for a specific id
function getItem(key, store, callback = null) {
    const objectStore = db.transaction(store, "readonly").objectStore(store); //Selects the object store
    const request = objectStore.get(key); //Selects the chosen key
    if (callback) { //Checking if a callback function was specified
        request.onsuccess = (event) => callback(event.target.result); //Calls the function specified 
    }
    request.onerror = (event) => console.log(`getItem failed. Error code: ${event.target.errorCode}`);
}
//Adding an item to an object store
function addItem(item, store, callback = null) {
    const objectStore = db.transaction(store, "readwrite").objectStore(store);
    const request = objectStore.add(item);
    if (callback) {
        request.onsuccess = (event) => callback(event.target.result); //This will return the key of the item
    }
    request.onerror = (event) => console.log(`addItem failed. Error code: ${event.target.errorCode}`);
}