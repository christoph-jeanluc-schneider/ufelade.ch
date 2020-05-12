var path = require( 'path' );
var express = require( 'express' );
var http = require( 'http' );
var helmet = require( 'helmet' );
var cookieParser = require( 'cookie-parser' );

var scores = require( './scores.js' );

const config = require( '../config.json' );
const static_directory = path.join( __dirname, '../wwwroot' );

var app = express();
app.use( helmet(), cookieParser(), express.json(), express.urlencoded( { extended: true } ) );
app.use( express.static( static_directory ) );

http.createServer( app ).listen( config.port, () => {
    console.log( `listening on port ${config.port}...` );
} );

app.post( '/validate', ( req, res ) => {
    let success = scores.validate( req.body.username, req.body.hash );
    if( success ) res.sendStatus( 200 );
    else res.sendStatus( 400 );
} );

app.post( '/upload', ( req, res ) => {
    scores.upload( req.body.username, req.body.bytes, req.body.filename );
    res.sendStatus( 200 );
} );

app.get( '/scores', ( req, res ) => {
    res.send( scores.get() );
} );
