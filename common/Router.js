var fs = require( 'fs' );
var path = require( 'path' );
// In newer Node.js versions where process is already global this isn't necessary.
var process = require( "process" );




//eval("var SmithyController = require('../controllers/SmithyController.js')");

module.exports = function Router() {
    var _this = this;
    this.areModulesImported = false;
    this.route = function(fullRoute, data) {
        console.log("************* Step3");
        var routeParts = fullRoute.split("/");
        _this.importControllers(_this.fnDone, routeParts, data);        
        //while(!_this.areModulesImported);
        console.log("************* Step4");        
        //return eval("new " + routeParts[1] + "Controller()")[routeParts[2]](data);
    };

    this.routeOld = function(controllerName, methodName, data) {
        console.log("************* Step5");
        //_this.importControllers();
        //while(!_this.areModulesImported);
        console.log("************* Step5.1");
        //return eval("new " + controllerName + "Controller()")[methodName](data);
    };

    this.fnDone = function(routeParts, data) {
        console.log("fnDone called....");
        eval("new _this." + routeParts[1] + "Controller()")[routeParts[2]](data);
    };

    this.importControllers = function(fnCallback, routeParts, data) {
        console.log("************* Step0");
        fs.readdir( "./controllers/", function( err, files ) {
            console.log("************* Step01");
            if( err ) {
                console.log("************* Step02");
                console.error( "Could not list the directory.", err );
                process.exit( 1 );
            } 
            console.log("************* Step1");
            files.forEach( function( file, index ) {
                    // Make one pass and make the file complete
                    var filePath = path.join( "./controllers/", file );
                    
                    console.log("************* Step1.1.1");
                    /*fs.statSync( filePath, function( error, stat ) {
                        if( error ) {
                            console.error( "Error stating file.", error );
                            return;
                        }
                        console.log("************* Step2");
                        if(stat.isFile()) {
                            console.log( "'%s' is a file.", file );
                            eval("var SmithyController = require('../controllers/" + file + "')");
                            console.log( "imported module %s.", file );
                            
                            //eval("new SmithyController()")["BuyItem"]({})
                        }
                        else if( stat.isDirectory() )
                            console.log( "'%s' is a directory.", fromPath );
                    } );*/
                    var fileStats = fs.statSync(filePath);
                    console.log(fileStats.fileName);
                    
                    if(fileStats.isFile()) {
                        console.log( "'%s' is a file.", file );
                        console.log(file.substring(0, file.length-2));
                        eval("_this.SmithyController = require('../controllers/" + file + "')");
                        console.log( "imported module %s.", file );                            
                        //eval("new SmithyController()")["BuyItem"]({})
                    }
                    else if(fileStats.isDirectory()) {
                        console.log( "'%s' is a directory.", fromPath );
                    }                    

                    const filesDone = index >= files.length - 1;
                    if (filesDone)
                        fnCallback(routeParts, data);
            } );            
                      
            
        });
        console.log("************* Step1.1.2");        
    };
};