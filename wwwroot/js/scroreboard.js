const scoreboard_body = document.getElementById( 'scoreboard' );

load_scoreboard();

setInterval( function () {
    load_scoreboard();
}, 5000 );

function load_scoreboard() {
    axios( {
        method: 'get',
        url: `/scoreboard/${Date.now()}`
    } )
        .then( function ( res ) {
            display_scoreboard( res.data );
        } )
        .catch( function ( err ) {
            console.error( err );
        } );
}

function display_scoreboard( scores ) {
    scoreboard_body.innerHTML = '';
    
    for( let i = 0; i < scores.length; i++ ) {
        scoreboard_body.innerHTML += `<tr><td>${scores[ i ].username}</td>`
            + `<td>${format_bytes( Number( scores[ i ].score ) )}</td>`
            + `<td>${format_number( scores[ i ].score )} Bytes</td></tr>`;
    }
}
