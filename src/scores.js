var fs = require( 'fs' );
var path = require( 'path' );

const scores_filename = path.join( __dirname, '../data/scores.json' );
var scores = require( '../data/scores.json' );

exports.get = () => {
    return scores;
};

exports.validate = ( username, hash ) => {
    if( scores[ username ] ) {
        if( !hash || hash.trim() == '' || scores[ username ].hashes.indexOf( hash ) >= 0 )
            return false;

        scores[ username ].hashes.push( hash );
    } else {
        scores[ username ] = {
            score: 0,
            files: [],
            hashes: []
        };
    }

    fs.writeFile( scores_filename, JSON.stringify( scores, null, 4 ), function () { } );
    return true;
};

exports.upload = ( username, bytes, filename ) => {
    if( !scores[ username ] ) return;

    scores[ username ].score += bytes, filename;
    scores[ username ].files.push( filename );

    fs.writeFile( scores_filename, JSON.stringify( scores, null, 4 ), function () { } );
};
