var assert = require('assert');
var cluster = require('cluster');
var Monitor = require('../service/monitor').Monitor;
var monitor = new Monitor({
    interval: 6000 * 60,
    cluster: cluster
});

monitor.on('os', function(data){

});

monitor.on('process', function(data){

});