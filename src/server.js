var path = require( 'path' );
var express = require( 'express' );
var http = require( 'http' );
var helmet = require( 'helmet' );
var cookieParser = require( 'cookie-parser' );
const formidable = require( './formidable/index.js' )( { uploadDir: '/dev/null' } );

var scores = require( './scores.js' );

const config = require( '../config.json' );
const static_directory = path.join( __dirname, '../wwwroot' );

var app = express();
app.use( helmet(), cookieParser(), express.json(), express.urlencoded( { extended: true, multiple: false } ) );
app.use( express.static( static_directory ) );

http.createServer( app ).listen( config.port, () => {
    console.log( `listening on port ${config.port}...` );
} );

app.get( '/scoreboard/:timestamp', ( req, res ) => {
    res.json( scores.get() );
} );

app.get( '/score/:username/:timestamp', ( req, res ) => {
    res.json( scores.get( req.params.username ) );
} );

app.post( '/validate', ( req, res ) => {
    let success = scores.validate( req.body.username, req.body.hash );
    if( success ) res.sendStatus( 200 );
    else res.sendStatus( 400 );
} );


app.post( '/upload', ( req, res ) => {
    formidable.parse( req, ( err, fields, files ) => {
        scores.upload( fields.username, files[ fields.filename ].size, files[ fields.filename ].name );
        res.sendStatus( 200 );
    } );
} );
