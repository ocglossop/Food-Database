function toggleActive() {
    let open = this.classList.contains('active'); //Checks whether this article is open or not
    const elements = document.getElementsByClassName('accordion');
    for (x of elements) {
        x.classList.remove('active'); //Closes any open articles
    }
    if (!open) { //If this article was closed initially
        this.classList.add('active'); //Open the article
    }
}
function toggleSetup() { //Sets up the accordion buttons
    const elements = document.getElementsByClassName('accordion'); //Gets the list of accordion buttons
    for (x of elements) {
        x.addEventListener('click', toggleActive); //Adds the event handler which handles toggling the button
        x.classList.add('js'); //Signifies that Javascript is active
    }
}