const username_header = document.getElementById( 'username-header' );

var username = localStorage.getItem( 'username' );

while( !username || username.trim() == '' )
    username = prompt( 'Wär bisch du?' );

localStorage.setItem( 'username', username );
username_header.innerText = username;
