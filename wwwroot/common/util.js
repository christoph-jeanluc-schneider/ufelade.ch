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

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', '&#8734;', '&#8734;', '&#8734;', '&#8734;', '&#8734;', '&#8734;', '&#8734;', '&#8734;' ];

    const i = Math.floor( Math.log( bytes ) / Math.log( k ) );

    return parseFloat( ( bytes / Math.pow( k, i ) ).toFixed( dm ) ) + ' ' + sizes[ i ];
}
