var rc = require('./Ningfile')
var cluster = require('cluster')
var os = require('os')
var numCPUs = os.cpus().length

if (cluster.isMaster) {
    var Monitor = require('./middleware/monitor').Monitor;
    var monitor = new Monitor({
        interval: 6000 * 60,
        pid: process.pid
    });
    monitor.on('os', function(data){

    });
    var pid = process.pid
    var log = function (info){
        console.log( (new Date).toISOString() + ' Master ' + pid + '\t| ' + info )
    }
    var killWorker = function(worker, done){
        // Because long living server connections may block workers from disconnecting,
        // it may be useful to send a message, so application specific actions may be taken to close them.
        // It also may be useful to implement a timeout, killing a worker if the disconnect event
        // has not been emitted after some time.
        worker.send('shutdown');
        worker.disconnect();
        var timeout = setTimeout(function() {
            worker.kill()
        }, 3000);
        worker.on('disconnect', function() {
            clearTimeout(timeout)
            done()
        });
    }
    var killWorkers = function (restart, done){
        var workers = Object.keys(cluster.workers);
        var kill = function(i) {
            if (i == workers.length) {
                return done();
            }
            var workerPid = cluster.workers[workers[i]].process.pid;
            log('Killing worker ' + workerPid);
            killWorker(cluster.workers[workers[i]], function(){
                log('Worker ' + workerPid + ' shutdown complete');
                i++;
                if(restart){
                    var newWorker = cluster.fork();
                    newWorker.on('listening', function() {
                        log('Replacement worker ' + newWorker.process.pid + ' online');
                        kill(i);
                    });
                }else{
                    kill(i)
                }
            });

        }
        kill(0)
    }

    // Put pidfile to logs directory
    var pidfile = require('path').join(__dirname, 'logs/ning.pid')
    require('fs').writeFileSync(pidfile, pid);

    cluster.on('listening', function(worker, address) {
        log('Worker ' + worker.process.pid + ' listening ' + address.address + ':' + address.port)
    })

    // Restart workers without downtime
    process.on('SIGHUP', function() {
        log('Got SIGHUP signal, restarting workers')

        // Delete the cached module, so we can reload the app
        delete require.cache[require.resolve("./index")]

        killWorkers(true, function(){
            log('Workers success restarted')
        })
    });

    process.on('SIGQUIT', function(){
        log('Got SIGQUIT signal, killing master and workers')
        killWorkers(false, function(){
            log('Workers success killed')
            process.exit()
        })

        // Normally below code should no opportunity to execution
        setTimeout(function() {
            log("Could not close connections in time, forcefully shutting down");
            process.exit()
        }, 1000 * 10);

    });

    cluster.on('exit', function(worker, code, signal) {
        if(worker.suicide === true) {
            log('Worker ' + worker.process.pid + ' was just suicide')
        }else if(code !== 0) {
            log('Worker ' + worker.process.pid + ' died with error code: ' + code)
        }else {
            log('Worker ' + worker.process.pid + ' died normally')
        }

        if(signal) {
            log('Worker ' + worker.process.pid + ' was killed by signal: ' + signal)
        }
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
    var app = express()
    var path = require('path')
    var node_modules = rc.node_modules
    var server
    var pid = process.pid
    var log = function (info){
        console.log( (new Date).toISOString() + ' Worker ' + pid + '\t| ' + info )
    }

    if(node_modules) {
        node_modules = [].concat(node_modules).map(function(p){
            return path.resolve(p)
        })
        module.paths = module.paths.concat(node_modules)
    }

    app.param('mod', function(req, res, next, name){
        try{
            var mod = require(name)
            req.mod = mod
            next()
        }catch(err){
            next(err);
        }
    })

    app.all('/cgi-bin/:mod', function(req, res, next){
        req.mod(req, res, next)
    })


    process.on('message', function(msg) {
        if(msg === 'shutdown') {
            log("Received kill signal, shutting down gracefully");
            server.close(function() {
                log("Closed out remaining connections");
                process.exit(0)
            });
            // Normally below code should no opportunity to execution
            setTimeout(function() {
                log("Could not close connections in time, forcefully shutting down");
                process.exit()
            }, 2000);
        }

    })

    server = app.listen(rc.port)
}
