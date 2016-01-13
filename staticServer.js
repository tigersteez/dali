var static = require('node-static');
 
var fileServer = new static.Server();
 
require('http').createServer(function (request, response) {
        fileServer.serve(request, response);;
}).listen(8080);
