var fs = require( 'fs' );
var path = require( 'path' );
// In newer Node.js versions where process is already global this isn't necessary.
var process = require( "process" );

fs.readdir( "./controllers/", function( err, files ) {
    if( err ) {
        console.error( "Could not list the directory.", err );
        process.exit( 1 );
    } 

    files.forEach( function( file, index ) {
            // Make one pass and make the file complete
            var filePath = path.join( "./controllers/", file );

            fs.stat( filePath, function( error, stat ) {
                if( error ) {
                    console.error( "Error stating file.", error );
                    return;
                }

                if(stat.isFile()) {
                    console.log( "'%s' is a file.", file );
                    eval("var SmithyController = require('../controllers/" + file + "')");
                }
                else if( stat.isDirectory() )
                    console.log( "'%s' is a directory.", fromPath );
            } );
    } );
} );

eval("var SmithyController = require('../controllers/SmithyController.js')");

module.exports = function Router() {
    _this = this;

    this.route = function(fullRoute, data) {
        var routeParts = fullRoute.split("/");
        
        return eval("new " + routeParts[1] + "Controller()")[routeParts[2]](data);
    };

    this.routeOld = function(controllerName, methodName, data) {
        return eval("new " + controllerName + "Controller()")[methodName](data);
    };    
};