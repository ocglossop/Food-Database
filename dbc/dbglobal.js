

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

    const foodStore = db.createObjectStore("foodStore", {autoIncrement: true});
    

    const recipeStore = db.createObjectStore("recipeStore", )

}
