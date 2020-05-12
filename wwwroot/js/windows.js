const windows = document.getElementsByClassName( 'window' );

for( let i = 0; i < windows.length; i++ ) {
    let window = windows[ i ];

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    window.firstElementChild.onmousedown = dragMouseDown;

    function dragMouseDown( e ) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;

        // add class for z-index
        for( let i = 0; i < windows.length; i++ )
            windows[ i ].classList.remove( 'active' );
        window.classList.add( 'active' );
    }

    function elementDrag( e ) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        window.style.top = ( window.offsetTop - pos2 ) + 'px';
        window.style.left = ( window.offsetLeft - pos1 ) + 'px';
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
