function Item(name, useBy = true, unit = '', qty = 0, added, expiry) {
    this.name = name; //The name of the food item
    this.qty = qty; //The amount of the item
    this.unit = unit; //The unit of the quantity
    this.useBy = useBy; //Whether or not the expiry date is a use by or best before. 'Use by' by default
    this.added = added; //The date the food was added
    this.expiry = expiry; //The expiry date of the food
}
var db; //This global variable will hold the database object

//Opening the database
function openDB() {
    return new Promise((resolve, reject) => { //Creates a promise
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
            
            const recipeStore = db.createObjectStore("recipeStore", {autoIncrement: true});
        
            const shoppingList = db.createObjectStore("shoppingList", {autoIncrement: true});
        }
    });
}

let dbPromise = openDB(); //The promise object is stored in the 'dbPromise' variable

//Quick function to open a transaction
async function getTrans(store, readwrite = true) {
    await dbPromise;
    let type = readwrite ? 'readwrite' : 'readonly'; //Whether or not the database is written or not
    let transaction = db.transaction(store, type);
    console.log(transaction);
    return transaction //Returns the transaction object.
}

//Reading data for a specific id
function getItem(key, store, callback = null) { 
    return new Promise(async (resolve, reject) => { //Async function, as it may have to wait for the database to be opened
        await dbPromise; //The function continues when the database object is ready
        const objectStore = db.transaction(store, "readonly").objectStore(store); //Selects the object store
        const request = objectStore.get(key); //Selects the chosen key

        
        request.onsuccess = (event) => {
            if (callback) { //Checking if a callback function is specified
                callback(event.target.result); //Calls the function specified
            }
            resolve(event.target.result);
        }
        request.onerror = (event) => {
            console.log(`getItem failed. Error code: ${event.target.errorCode}`);
            reject(event.target.errorCode);
        };
    })
}
//Adding an item to an object store
async function addItem(item, store, callback = null) {
    await dbPromise;
    const objectStore = db.transaction(store, "readwrite").objectStore(store);
    const request = objectStore.add(item);

    if (callback) { 
        request.onsuccess = (event) => callback(event.target.result); //This will return the key of the item
    }
    request.onerror = (event) => console.log(`addItem failed. Error code: ${event.target.errorCode}`);
    return
}
//Retrieveing all the items in the object store
function getAllItems(store) {
    return new Promise(async (resolve, reject) => {
        await dbPromise;
        let list = {};
        const objectStore = db.transaction(store, "readonly").objectStore(store);
        const request = objectStore.openCursor(); //Creates a cursor to iterate through each item
        
        request.onsuccess = (event) => {
            const cursor = event.target.result; //Stores the cursor object
            if (cursor) {
                list[cursor.key] = cursor.value; //Add the object and its key to an array
                cursor.continue(); //Goes to the next item
            } else { //When there are no items left
                resolve(list);
            } 
        };
        request.onerror = (event) => {
            console.log(`getAllItems failed. Error code: ${event.target.errorCode}`);
            reject(event.target.errorCode);
        };
        return
    })
}
//Updating an entry
function updateItem(key, item, store, callback = null) {
    return new Promise(async (resolve, reject) => {    
        await dbPromise;
        const objectStore = db.transaction(store, "readwrite").objectStore(store);
        const request = objectStore.put(item, key); //Puts the new item in at the specified key

        request.onsuccess = (event) => {
            if (callback) { 
                callback(event.target.result); 
            }
            resolve(event.target.result);
        }
        request.onerror = (event) => {
            console.log(`updateItem failed. Error code: ${event.target.errorCode}`);
            reject(event.target.errorCode);
        };
    });
}

//Removing an entry
function removeItem(key, store, callback = null) { 
    return new Promise(async (resolve, reject) => { 
        await dbPromise; 
        const objectStore = db.transaction(store, "readwrite").objectStore(store); 
        const request = objectStore.delete(key); //Deletes the item
        
        request.onsuccess = (event) => {
            if (callback) { 
                callback(event.target.result); 
            }
            resolve(event.target.result);
        }
        request.onerror = (event) => {
            console.log(`removeItem failed. Error code: ${event.target.errorCode}`);
            reject(event.target.errorCode);
        };
    })
}

//Adding several items at once
function addArray(items, store) {
    return new Promise(async (resolve, reject) => {
        await dbPromise;
        const transaction = db.transaction(store, "readwrite"); //Gets the transaction in an object
        
        //Once all items are added
        transaction.oncomplete = (event) => {resolve(event.target.result)};
        transaction.onerror = (event) => {
            console.log(`addArray failed. Error code: ${event.target.errorCode}`);
            reject(event.target.errorCode);
        };
        transaction.onabort = (event) => {
            console.log(`addArray aborted. Error code: ${event.target.errorCode}`);
            reject(event.target.errorCode);
        };
        
        const objectStore = transaction.objectStore(store);
        for (x in items) { //Iterates through each item
            const request = objectStore.add(items[x]);
            request.onerror = () => transaction.abort(); //Undoes all changes if something goes wrong
            request.onsuccess = () => console.log(items[x]);
        }

        
    })
}