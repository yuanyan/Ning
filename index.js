var rc = require('./Ningfile')
var cluster = require('cluster')
var os = require('os')
var numCPUs = os.cpus().length

if (cluster.isMaster) {
    if (rc.instances == 'max') {
        rc.instances = numCPUs
    }
    // Fork workers.
    for (var i = 0; i < Number(rc.instances); i++) {
        cluster.fork()
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died')
    })
} else {
    // Workers can share any TCP connection
    // In this case its a HTTP server
    var express = require('express')
    var server = express()
    var path = require('path')
    var node_modules = rc.node_modules

    if(node_modules) {
        node_modules = [].concat(node_modules).map(path.resolve)
        module.paths = module.paths.concat(node_modules)
    }

    server.param('mod', function(req, res, next, name){
        try{
            var mod = require(name)
            req.mod = mod
            next()
        }catch(err){
            next(err);
        }
    });

    server.all('/cgi-bin/:mod', function(req, res, next){
        req.mod(req, res, next)
    })

    server.listen(rc.port)
}