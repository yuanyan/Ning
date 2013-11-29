// Workers can share any TCP connection
// In this case its a HTTP server
var ningfilePath = process.env.NINGFILE_PATH || './Ningfile';
var silent = 'test' == process.env.NODE_ENV;
var rc = require(ningfilePath);
var express = require('express');
var app = express();
var path = require('path');
var node_modules = rc.node_modules;
var app_modules = rc.node_modules;
var server;
var logger = require('./service/logger');
var info = logger.info;
var pid = process.pid;

if(node_modules) {
    node_modules = [].concat(node_modules).map(function(p){
        return path.resolve(p)
    })
    module.paths = module.paths.concat(node_modules)
}

// our custom "verbose errors" setting
// which we can use in the templates
// via settings['verbose errors']
app.enable('verbose errors');

// disable them in production
// use $ NODE_ENV=production node examples/error-pages
if ('production' == app.settings.env) {
    app.disable('verbose errors');
}

silent || app.use(express.logger('dev'));

app.param('mod', function(req, res, next, name){
    try{
        var mod = require(name);
        req.mod = mod;
        next();
    }catch(err){
        next(err);
    }
})

app.all('/cgi-bin/:mod', function(req, res, next){
    req.mod(req, res, next)
})

process.on('message', function(msg) {
    if(msg === 'shutdown') {
        info("Received kill signal, shutting down gracefully");
        server.close(function() {
            info("Closed out remaining connections");
            process.exit(0)
        });
        // Normally below code should no opportunity to execution
        setTimeout(function() {
            info("Could not close connections in time, forcefully shutting down");
            process.exit()
        }, 2000);
    }
})

server = app.listen(rc.http_port, rc.http_hostname, rc.http_backlog)
