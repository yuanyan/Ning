var rc = require('./Ningfile')
var cluster = require('cluster')
var os = require('os')
var numCPUs = os.cpus().length

if (cluster.isMaster) {
    var masterPid = process.pid

    cluster.on('listening', function(worker, address) {
        console.log( (new Date).toISOString() + ' ' + masterPid +
            '\t| worker ' + worker.process.pid + ' listening ' + address.address + ':' + address.port)
    })

    cluster.on('exit', function(worker, code, signal) {
        console.log( (new Date).toISOString() + ' ' + masterPid +
            '\t| worker ' + worker.process.pid + ' died')
    })

    if (rc.instances == 'max') {
        rc.instances = numCPUs
    }
    // Fork workers.
    for (var i = 0; i < Number(rc.instances); i++) {
        cluster.fork()
    }
} else {
    // Workers can share any TCP connection
    // In this case its a HTTP server
    var express = require('express')
    var server = express()
    var path = require('path')
    var node_modules = rc.node_modules

    if(node_modules) {
        node_modules = [].concat(node_modules).map(function(p){
            return path.resolve(p)
        })
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