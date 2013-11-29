var EventEmitter = require('events').EventEmitter;var util = require("util");var exec = require('child_process').exec;var os = require('os');var TOTALMEM  = os.totalmem();function getOSMemUsage(){    return os.freemem()/TOTALMEM}function getOSCpuUsage(){    var cpus = os.cpus();    var numCPUs = cpus.length;    var usages = [], times;    for(var i=0; i<numCPUs; i++) {        // user: 2414630        // nice: 0        // sys: 461520        // idle: 29435660        // irq: 0        times = cpus[i]['times'];        usages.push( (times.sys + times.user) / (times.sys + times.user + times.idle) );    }    return usages;}// Returns an array containing the 1, 5, and 15 minute load averages,// load averages is for the entire systemfunction getOSLoadavg(){    return os.loadavg()}function getProcessInfo(param, callback) {    if (process.platform === 'windows') return;    var pid = param.pid;    var psCommand = "ps auxw | grep " + pid + " | grep -v 'grep'";    exec(psCommand, function(err, stdout) {        if (err) {            return callback(err, null);        }        var output = [];        var outArray = stdout.toString().replace(/^\s+|\s+$/g,"").split(/\s+/);        for (var i = 0; i < outArray.length; i++) {            if ((!isNaN(outArray[i]))) {                output.push(outArray[i]);            }        }        var ps = {            pid: pid,            usr: 0,            sys: 0,            gue: 0        };        ps.cpuAvg = output[1];        ps.memAvg = output[2];        ps.vsz = output[3];        ps.rss = output[4];        var pidstatCommand = "pidstat -p " + pid;        exec(pidstatCommand, function(err, stdout) {            if (err) {                console.error(err);                return callback(null, ps);            }            var output = [];            var outArray = stdout.toString().replace(/^\s+|\s+$/g,"").split(/\s+/);            for (var i = 0; i < outArray.length; i++) {                if ((!isNaN(outArray[i]))) {                    output.push(outArray[i]);                }            }            ps.usr = output[1];            ps.sys = output[2];            ps.gue = output[3];            callback(null, ps);        });    });}function Monitor(options){    EventEmitter.call(this);    this.options = options;    this.cluster = options.cluster;    var that = this;    this.intervalId  = setInterval(function(){        if(options.os){            that.os()        }        if(options.process){            that.process()        }    }, options.interval);}util.inherits(Monitor, EventEmitter);Monitor.prototype.os = function() {    // TODO getOSNet getOSStorage    var data = {        cpu: getOSCpuUsage(),        mem: getOSMemUsage(),        laodavg: getOSLoadavg()    }    this.emit("os", data);}Monitor.prototype.process = function(){    var workers = this.cluster.workers;    Object.keys(workers).forEach(function(id){        var pro = workers[id].process        getProcessInfo(pro, function(data){            this.emit("process", data)        })    })}Monitor.prototype.stop = function(){    if(this.intervalId){        clearInterval(this.intervalId)    }}exports.Monitor = Monitor;