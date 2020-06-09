var fs = require( 'fs' );
var path = require( 'path' );

if( !fs.existsSync( path.join( __dirname, '../data' ) ) )
    fs.mkdirSync( path.join( __dirname, '../data' ) );

require( './db.js' ).init();

require( './server.js' );
