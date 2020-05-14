var fs = require( 'fs' );
var path = require( 'path' );

const scores_filename = path.join( __dirname, '../data/scores.json' );
var scores = require( '../data/scores.json' );

exports.get = ( username ) => {
    if( username ) return scores[ username ];
    return scores;
};

exports.validate = ( username, hash ) => {
    return !scores[ username ] || !scores[ username ].hashes || scores[ username ].hashes.indexOf( hash ) == -1;
};

exports.upload = ( username, bytes, filename, hash ) => {
    if( !scores[ username ] )
        scores[ username ] = { score: 0, files: [], hashes: [] };

    scores[ username ].score += bytes, filename;
    scores[ username ].files.push( filename );
    scores[ username ].hashes.push( hash );

    fs.writeFile( scores_filename, JSON.stringify( scores, null, 4 ), function () { } );
};
