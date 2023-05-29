//Based on an example from W3Schools
function includeHTML() { //Function to allow for HTML elements to be included
    var i, x, elements;

    elements = document.getElementsByClassName('include-html'); //Gets all the elements in the 'include-html' class.
    max = elements.length;
    for (i = 0; i < max; i++) {
        x = elements[i];
        ref = x.getAttribute('data-include-src'); //Gets the source of the element to include
        if (ref) { //Ensures that the target element has a source
            //Sets up an HTML request to get the source element
            xhttp = new XMLHttpRequest(); 
            xhttp.onload = function() {
                if (this.status == 200) {
                    x.innerHTML = this.responseText; //Checks that the data has been received
                    x.classList.add('ready'); //Adds the 'ready' class to the element when the data has been loaded
                } 
            };
            xhttp.open("GET", ref, false);
            xhttp.send();
        }
    }
}