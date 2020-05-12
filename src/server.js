var path = require( 'path' );
var express = require( 'express' );
var http = require( 'http' );
var helmet = require( 'helmet' );
var cookieParser = require( 'cookie-parser' );

const config = require( '../config.json' );
const static_directory = path.join( __dirname, '../wwwroot' );

var app = express();
app.use( helmet(), cookieParser(), express.json(), express.urlencoded( { extended: true } ) );
app.use( express.static( static_directory ) );

http.createServer( app ).listen( config.port, () => {
    console.log( `listening on port ${config.port}...` );
} );
