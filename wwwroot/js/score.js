const username_header = document.getElementById( 'username-header' );
const my_score = document.getElementById( 'my-score' );
const my_score_formated = document.getElementById( 'my-score-formated' );

var username = localStorage.getItem( 'username' );

while( !username || username.trim() == '' )
    username = prompt( 'Wär bisch du?' );

localStorage.setItem( 'username', username );
username_header.innerText = username;

load_history( username );

setInterval( function () {
    fetch_score();
}, 500 );

function fetch_score() {
    axios( {
        method: 'get',
        url: `/score/${username}/${Date.now()}`
    } )
        .then( function ( res ) {
            if( res.data.score ) update_score( res.data.score );
        } )
        .catch( function ( err ) {
            console.error( err );
        } );
}

function update_score( bytes ) {
    my_score.innerHTML = `${format_number( bytes )} Bytes`;
    my_score_formated.innerHTML = format_bytes( Number( bytes ) );
}
