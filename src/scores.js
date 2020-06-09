var database = require( './db.js' );

exports.get = ( username ) => {
    if( username ) {
        let player = database.get( username );
        return !!player ? player : {};
    }
    return database.getAll();
};

exports.validate = ( username, hash ) => {
    let entry = database.get( username );

    if( !entry || !entry.username || entry.username.trim() == "" ) {
        database.insert( username );
        return true;
    } else {
        return !entry.hashes || entry.hashes.indexOf( hash ) == -1;
    }
};

exports.upload = ( username, bytes, filename, hash ) => {
    let entry = database.get( username );

    if( !entry ) return;

    database.update.score( username, Number( entry.score) + Number( bytes) );

    if( entry.files && typeof entry.files == "string" )
        database.update.files( username, `${entry.files};${filename}` );
    else
        database.update.files( username, filename );

    if( entry.hashes && typeof entry.hashes == "string" )
        database.update.hashes( username, `${entry.hashes};${hash}` );
    else
        database.update.hashes( username, hash );
};
