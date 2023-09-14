var inEditMode = false;
function editMode(callback) { //Sets up 'edit mode'
    const form = document.getElementById('edit-buttons');
    for (y of form.children) { //For each of the buttons
        if (y.hasAttribute('data-hidden')) { //Reveals the hidden buttons
            y.removeAttribute('disabled');
            y.style.display = 'inline-block';
        } else { //Hides the edit button
            y.setAttribute('disabled', true);
            y.style.display = 'none'
        }
    };
    form.classList.add('sticky'); //Makes the 'save' and 'revert' buttons stick to the top
    document.getElementById('output').classList.add('edit'); //Styles the output list correctly
    inEditMode = true;
    if (callback) { //To open 'edit mode'
        callback();
    }
}
function editRevert(callback) {
    const form = document.getElementById('edit-buttons');
    for (y of form.children) { //For each of the buttons
        if (!y.hasAttribute('data-hidden')) { //Reveals the edit button
            y.removeAttribute('disabled');
            y.style.display = 'inline-block';
        } else { //Hides the visible buttons
            y.setAttribute('disabled', true);
            y.style.display = 'none'
        }
    };
    form.classList.remove('sticky'); //Stops the buttons from sticking
    document.getElementById('output').classList.remove('edit'); //Styles the output list correctly
    inEditMode = false;
    if (callback) { //To exit 'edit mode'
        callback();
    }
}
async function editSave(store, callback, attributes = {'name':'name', 'qty':'qty', 'unit':'unit'}) { //{name of attribute: name of input}
    const forms = document.getElementsByClassName('edit-forms'); //A list of all the individual forms for each item
    for (x of forms) { //For each form
        let key = x.getAttribute('data-key'); //Get the key of the item
        const item = await getItem(Number(key), store);
        for (y in attributes) { //For each attribute
            item[y] = x[attributes[y]].value //Set the attribute of the item 
            console.log(x[attributes[y]].value);
        }
        updateItem(Number(key), item, store); //Update the item
    };
     
    const form = document.getElementById('edit-buttons');
    for (y of form.children) { //For each of the buttons
        if (!y.hasAttribute('data-hidden')) { //Reveals the edit button
            y.removeAttribute('disabled');
            y.style.display = 'inline-block';
        } else { //Hides the visible buttons
            y.setAttribute('disabled', true);
            y.style.display = 'none'
        }
    };
    form.classList.remove('sticky');
    document.getElementById('output').classList.remove('edit'); //Styles the output list correctly
    inEditMode = false;
    if (callback) { //To exit 'edit mode'
        callback();
    }
}

async function editSaveArray(array, callback, attributes = {'name':'name', 'qty':'qty', 'unit':'unit'}) { //For the list of ingredients
    const forms = document.getElementsByClassName('edit-forms'); //A list of all the individual forms for each item
    for (x of forms) { //For each form
        let index = x.getAttribute('data-index'); //Get the index of the item
        const item = array[index]; //Get the item from the array
        for (y in attributes) { //For each attribute
            item[y] = x[attributes[y]].value //Set the attribute of the item 
        }
    };
    //Array will be saved by the callback function
     
    const form = document.getElementById('edit-buttons');
    for (y of form.children) { //For each of the buttons
        if (!y.hasAttribute('data-hidden')) { //Reveals the edit button
            y.removeAttribute('disabled');
            y.style.display = 'inline-block';
        } else { //Hides the visible buttons
            y.setAttribute('disabled', true);
            y.style.display = 'none'
        }
    };
    form.classList.remove('sticky');
    document.getElementById('output').classList.remove('edit'); //Styles the output list correctly
    inEditMode = false;
    if (callback) { //To exit 'edit mode'
        callback();
    }
}

