const button = document.getElementById( 'upload-button' );
const fileinput = document.getElementById( 'fileinput' );
const history = document.getElementById( 'history' );
const progress_hash = document.getElementById( 'progress-hash' );
const progress_upload = document.getElementById( 'progress-upload' );
const error_message = document.getElementById( 'error-message' );

const upload_step_size = 1024 * 4;
const upload_timeout = 2;

button.onclick = function () {
    fileinput.click();
};

fileinput.onchange = function () {
    let file = fileinput.files[ 0 ];
    if( !file || !file.name ) return;

    goto_progress_state();
    error_message.innerHTML = '';

    _hash( file, function ( hash ) {
        progress_hash.value = progress_hash.max;

        axios( {
            method: 'post',
            url: '/validate',
            data: {
                username: username,
                hash: hash
            }
        } )
            .then( function ( res ) {
                Upload( file, username, hash,
                    function ( loaded, total ) {
                        progress_upload.value = loaded;
                        progress_upload.max = total;
                    }, function ( success ) {
                        history.innerHTML += `<p>${file.name}</p>`;
                        history.scrollTop = 99999999999999999;
                        goto_default_state();
                    } );
            } )
            .catch( function ( err ) {
                error_message.innerHTML = 'Duu, die Datei hani scho... gib mer en anderi!!';
                goto_default_state();
            } );
    } );
};

function load_history( username ) {
    axios( {
        method: 'get',
        url: `/score/${username}/${Date.now()}`
    } )
        .then( function ( res ) {
            if( res.data.score )
                update_score( res.data.score );

            if( res.data.files && res.data.files.length > 0 ) {
                history.innerHTML = `<p>${res.data.files.split( ';' ).join( '</p><p>' )}</p>`;
                history.scrollTop = 999999999999999;
            }
        } )
        .catch( function ( err ) {
            console.error( err );
        } );
}

function goto_progress_state() {
    uploading = true;
    progress_upload.classList.add( 'active' );
    progress_hash.classList.add( 'active' );
    progress_upload.classList.remove( 'hidden' );
    progress_hash.classList.remove( 'hidden' );
    progress_upload.value = 0;
    progress_hash.value = 0;
    button.classList.add( 'hidden' );
}

function goto_default_state() {
    uploading = false;
    progress_upload.classList.remove( 'active' );
    progress_hash.classList.remove( 'active' );
    progress_upload.classList.add( 'hidden' );
    progress_hash.classList.add( 'hidden' );
    progress_upload.value = 0;
    progress_hash.value = 0;
    button.classList.remove( 'hidden' );
}
