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
    goto_progress_state();
    error_message.innerHTML = '';

    let file = fileinput.files[ 0 ];
    _hash( file, function ( hash ) {
        axios( {
            method: 'post',
            url: '/validate',
            data: {
                username: username,
                hash: hash
            }
        } )
            .then( function ( res ) {
                progress_upload.max = file.size;
                upload_animaion( 0, file.size, file.name );
            } )
            .catch( function ( err ) {
                console.error( err );
                error_message.innerHTML = 'Duu, die Datei hani scho... gib mer en anderi!!';
                goto_default_state();
            } );
    } );
};

function _hash( file, callback ) {
    var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        chunkSize = 2097152,
        chunks = Math.ceil( file.size / chunkSize ),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader();

    progress_hash.max = chunks;

    fileReader.onload = function ( e ) {
        console.debug( `hashing chunk ${currentChunk} of ${chunks} in total...` );
        progress_hash.value = currentChunk;

        spark.append( e.target.result );
        currentChunk++;

        if( currentChunk < chunks ) loadNext();
        else callback( spark.end() );
    };

    fileReader.onerror = function ( err ) {
        console.error( err );
        error_message.innerHTML = 'Ah fuck, irgeepis het nid funktioniert... sorry.<br>Drück schnäll "F5" uf dr Tastatur zum dSiitä nöi ladä!';
        goto_default_state();
    };

    function loadNext() {
        var start = currentChunk * chunkSize,
            end = ( ( start + chunkSize ) >= file.size ) ? file.size : start + chunkSize;

        fileReader.readAsArrayBuffer( blobSlice.call( file, start, end ) );
    }

    loadNext();
}

function upload_animaion( value, max, filename ) {
    console.debug( `upload: ${value} / ${max} )` );
    progress_upload.value = value;

    if( value >= max ) {
        axios( {
            method: 'post',
            url: '/upload',
            data: {
                username: username,
                bytes: max,
                filename: filename
            }
        } )
            .then( function ( res ) {
                history.innerHTML += `<p>${filename}</p>`;
            } )
            .catch( function ( err ) {
                console.error( err );
                error_message.innerHTML = 'Ah fuck, irgeepis het nid funktioniert... sorry.<br>Drück schnäll "F5" uf dr Tastatur zum dSiitä nöi ladä!';
            } )
            .then( function () {
                goto_default_state();
            } );
        return;
    }

    setTimeout( function () {
        value += upload_step_size;
        upload_animaion( value, max, filename );
    }, upload_timeout );
}

function load_history( username ) {
    axios( {
        method: 'get',
        url: `/score/${username}/${Date.now()}`
    } )
        .then( function ( res ) {
            if( res.data.score )
                update_score( res.data.score );

            if( res.data.files && res.data.files.length > 0 )
                history.innerHTML = `<p>${res.data.files.join( '</p><p>' )}</p>`;
        } )
        .catch( function ( err ) {
            console.error( err );
        } );
}

function goto_progress_state() {
    progress_upload.classList.add( 'active' );
    progress_hash.classList.add( 'active' );
    progress_upload.value = 0;
    progress_hash.value = 0;
    button.classList.add( 'hidden' );
}

function goto_default_state() {
    progress_upload.classList.remove( 'active' );
    progress_hash.classList.remove( 'active' );
    progress_upload.value = 0;
    progress_hash.value = 0;
    button.classList.remove( 'hidden' );
}
