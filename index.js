var cluster = require('cluster');
var os = require('os');
var numCPUs = os.cpus().length;

if (cluster.isMaster) {

    var ningfile = process.env.NINGFILE || './Ningfile';
    var rc = require(ningfile);
    var logger = require('./service/logger');
    var info = logger.info;
    var pid = process.pid;

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
            info('Killing worker ' + workerPid);
            killWorker(cluster.workers[workers[i]], function(){
                info('Worker ' + workerPid + ' shutdown complete');
                i++;
                if(restart){
                    var newWorker = cluster.fork();
                    newWorker.on('listening', function() {
                        info('Replacement worker ' + newWorker.process.pid + ' online');
                        kill(i);
                    });
                }else{
                    kill(i)
                }
            });

        }
        kill(0)
    }

    cluster.on('listening', function(worker, address) {
        info('Worker ' + worker.process.pid + ' listening ' + address.address + ':' + address.port)
    })

    // Restart workers without downtime
    process.on('SIGHUP', function() {
        info('Got SIGHUP signal, restarting workers')

        // Delete the cached module, so we can reload the app
        delete require.cache[require.resolve("./index")]

        killWorkers(true, function(){
            info('Workers success restarted')
        })
    });

    process.on('SIGQUIT', function(){
        info('Got SIGQUIT signal, killing master and workers')
        killWorkers(false, function(){
            info('Workers success killed')
            process.exit()
        })

        // Normally below code should no opportunity to execution
        setTimeout(function() {
            info("Could not close connections in time, forcefully shutting down");
            process.exit()
        }, 1000 * 10);

    });

    cluster.on('exit', function(worker, code, signal) {
        if(worker.suicide === true) {
            info('Worker ' + worker.process.pid + ' was just suicide')
        }else if(code !== 0) {
            info('Worker ' + worker.process.pid + ' died with error code: ' + code)
        }else {
            info('Worker ' + worker.process.pid + ' died normally')
        }

        if(signal) {
            info('Worker ' + worker.process.pid + ' was killed by signal: ' + signal)
        }
    })

    if (rc.worker_processes == 'auto') {
        rc.worker_processes = numCPUs
    }
    // Fork workers.
    for (var i = 0; i < Number(rc.worker_processes); i++) {
        cluster.fork()
    }
} else {
    require('./app')
}
