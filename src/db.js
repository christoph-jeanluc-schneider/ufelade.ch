var fs = require( "fs" );
var path = require( "path" );
var connector = require( "better-sqlite3" );

const db_path = path.join( __dirname, "../data" );
const db_name = path.join( __dirname, "../data/ufelade.db" );

var db;
var queries;

var init_query = `
    CREATE TABLE IF NOT EXISTS player (
        username TEXT
        , score INTEGER
        , files TEXT
        , hashes TEXT
    );
`;

exports.init = () => {
    if( !fs.existsSync( db_path ) )
        fs.mkdirSync( db_path );
    db = connector( db_name );

    db.exec( init_query );

    queries = {
        getAll: db.prepare( "SELECT * FROM player ORDER BY score DESC" ),
        get: db.prepare( "SELECT * FROM player WHERE username = ?" ),
        insert: db.prepare( "INSERT INTO player (username, score, files, hashes) VALUES (?, ?, ?, ?)" ),
        update_score: db.prepare( "UPDATE player SET score = ? WHERE username = ?" ),
        update_files: db.prepare( "UPDATE player SET files = ? WHERE username = ?" ),
        update_hashes: db.prepare( "UPDATE player SET hashes = ? WHERE username = ?" )
    };


    console.log( "database is ready" );
};

exports.getAll = () => {
    return queries.getAll.all();
};

exports.get = ( username ) => {
    return queries.get.get( username );
};

exports.insert = ( username ) => {
    queries.insert.run( username, 0, "", "" );
};

exports.update = {};
exports.update.score = ( username, score ) => {
    queries.update_score.run( score, username );
};
exports.update.files = ( username, files ) => {
    queries.update_files.run( files, username );
};
exports.update.hashes = ( username, hashes ) => {
    queries.update_hashes.run( hashes, username );
};