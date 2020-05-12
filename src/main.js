var fs = require( 'fs' );
var path = require( 'path' );

if( !fs.existsSync( path.join( __dirname, '../data' ) ) )
    fs.mkdirSync( path.join( __dirname, '../data' ) );

if( !fs.existsSync( path.join( __dirname, '../data/scores.json' ) ) )
    fs.writeFileSync( path.join( __dirname, '../data/scores.json' ), '{}' );

require( './server.js' );
