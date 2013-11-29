var path = require('path');
var winston = require('winston');

var dailyLogger = new (winston.Logger)({
    transports: [
        new winston.transports.Console({
            timestamp: true,
            handleExceptions: true
        }),
        new winston.transports.DailyRotateFile({
            filename: path.join(__dirname, '..', 'logs', 'daily.log'),
            datePattern: '.yyyy-MM-dd',
            json: false,
            timestamp: true,
            handleExceptions: true
        })
    ],
    exitOnError: false
});

var errorLogger = new (winston.Logger)({
    transports: [
        new winston.transports.DailyRotateFile({
            level: 'error',
            filename: path.join(__dirname, '..', 'logs', 'error.log'),
            datePattern: '.yyyy-MM-dd',
            json: false,
            timestamp: true,
            handleExceptions: true
        })
    ],
    exitOnError: false
});

module.exports = {
    info: dailyLogger.info,
    warn: dailyLogger.warn,
    error: function(){
        dailyLogger.error.apply(dailyLogger, arguments);
        errorLogger.error.apply(errorLogger, arguments);
    }
};
