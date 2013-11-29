var assert = require('assert');
var scheduler = require('../service/scheduler');
var Range = scheduler.Range;
var RecurrenceRule = scheduler.RecurrenceRule;

var date = new Date(2012, 11, 21, 5, 30, 0);

var j = scheduler.scheduleJob(date, function(){
    console.log('The world is going to end today.');
});

// j.cancel();

var rule = new RecurrenceRule();
rule.minute = 42;

var j = scheduler.scheduleJob(rule, function(){
    console.log('The answer to life, the universe, and everything!');
});

var rule = new RecurrenceRule();
rule.dayOfWeek = [0, new Range(4, 6)];
rule.hour = 17;
rule.minute = 0;

var j = scheduler.scheduleJob(rule, function(){
    console.log('Today is recognized by Rebecca Black!');
});

// Object Literal Syntax
var j = scheduler.scheduleJob({hour: 14, minute: 30, dayOfWeek: 0}, function(){
    console.log('Time for tea!');
});

// Cron-style Scheduling
var j = scheduler.scheduleJob('42 * * * *', function(){
    console.log('The answer to life, the universe, and everything!');
});

var j = scheduler.scheduleJob('0 17 ? * 0,4-6', function(){
    console.log('Today is recognized by Rebecca Black!');
});
