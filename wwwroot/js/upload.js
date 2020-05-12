const button = document.getElementById( 'upload-button' );
const fileinput = document.getElementById( 'fileinput' );
const history = document.getElementById( 'history' );
const progress = document.getElementById( 'progress' );
const error_message = document.getElementById( 'error-message' );

button.onclick = function () {
    fileinput.click();
};

fileinput.onchange = function () {
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
                progress.classList.add( 'active' );
                button.classList.add( 'hidden' );
                progress.max = file.size;
                progress.value = 0;
                upload_animaion( 0, file.size, file.name );
            } )
            .catch( function ( err ) {
                console.error( err );
                error_message.innerHTML = 'Duu, die Datei hani scho... gib mer en anderi!!';
            } );
    } );
};

function _hash( file, callback ) {
    var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        chunkSize = 2097152,                             // Read in chunks of 2MB
        chunks = Math.ceil( file.size / chunkSize ),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader();

    fileReader.onload = function ( e ) {
        spark.append( e.target.result );                   // Append array buffer
        currentChunk++;

        if( currentChunk < chunks ) loadNext();
        else callback( spark.end() );
    };

    fileReader.onerror = function ( err ) {
        console.warn( err );
        error_message.innerHTML = 'Ah fuck, irgeepis het nid funktioniert... sorry.<br>Drück schnäll "F5" uf dr Tastatur zum dSiitä nöi ladä!';
    };

    function loadNext() {
        var start = currentChunk * chunkSize,
            end = ( ( start + chunkSize ) >= file.size ) ? file.size : start + chunkSize;

        fileReader.readAsArrayBuffer( blobSlice.call( file, start, end ) );
    }

    loadNext();
}

function upload_animaion( value, max, filename ) {
    progress.value = value;

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
                progress.classList.remove( 'active' );
                button.classList.remove( 'hidden' );
                progress.value = 0;
                history.innerHTML += `<p>${filename}</p>`;
            } )
            .catch( function ( err ) {
                console.error( err );
                error_message.innerHTML = 'Ah fuck, irgeepis het nid funktioniert... sorry.<br>Drück schnäll "F5" uf dr Tastatur zum dSiitä nöi ladä!';
            } );
        return;
    }

    setTimeout( function () {
        value += 20;
        upload_animaion( value, max, filename );
    }, 20 );
}
