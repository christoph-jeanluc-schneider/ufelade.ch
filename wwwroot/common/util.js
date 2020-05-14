function format_number( number ) {
    let digits = BigInt( number ).toString().split( '' ).reverse();
    let output = []

    for( let i = 0; i < digits.length; i++ ) {
        output.push( digits[ i ] );
        if( ( i + 1 ) % 3 == 0 && i < digits.length - 1 ) output.push( "'" );
    }
    return output.reverse().join( '' );
}

function format_bytes( bytes, decimals = 0 ) {
    if( bytes === 0 ) return '0 Bytes';

    const k = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', '&#8734;', '&#8734;', '&#8734;', '&#8734;', '&#8734;', '&#8734;', '&#8734;', '&#8734;' ];

    const i = Math.floor( Math.log( bytes ) / Math.log( k ) );

    return parseFloat( ( bytes / Math.pow( k, i ) ).toFixed( dm ) ) + ' ' + sizes[ i ];
}

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

function Upload( file, user, hash, onProgress, onComplete ) {
    var formData = new FormData();
    formData.append( file.name, file );
    formData.append( 'username', user );
    formData.append( 'filename', file.name );
    formData.append( 'hash', hash );

    var xhr = new XMLHttpRequest();
    xhr.open( 'post', '/upload', true );
    xhr.upload.onprogress = ( ev ) => {
        onProgress( ev.loaded, ev.total );
    }
    xhr.onload = ( ev ) => {
        onComplete( xhr.status == 200 );
    }
    xhr.send( formData );
};
