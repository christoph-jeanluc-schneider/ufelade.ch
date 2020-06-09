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
    let scoreboard = [];

    for( let username in scores ) {
        scoreboard.push( {
            username: username,
            score: scores[ username ].score
        } );
    }

    scoreboard.sort( function ( a, b ) {
        return a.score > b.score ? -1 : 1;
    } );

    scoreboard_body.innerHTML = '';
    for( let i = 0; i < scoreboard.length; i++ ) {
        scoreboard_body.innerHTML += `<tr><td>${scoreboard[ i ].username}</td>`
            + `<td>${format_bytes( Number( scoreboard[ i ].score ) )}</td>`
            + `<td>${format_number( scoreboard[ i ].score )} Bytes</td></tr>`;
    }
}
