var path = require('path');
var winston = require('winston');

var webLogger = new (winston.Logger)({
    transports: [
        new winston.transports.Console({
            timestamp: true,
            handleExceptions: true
        }),
        new winston.transports.DailyRotateFile({
            filename: path.join(__dirname, '..', 'logs', 'web.log'),
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


var accessLogger = new (winston.Logger)({
    transports: [
        new winston.transports.Console({
            timestamp: false
        }),
        new winston.transports.DailyRotateFile({
            filename: path.join(__dirname, '..', 'logs', 'access.log'),
            datePattern: '.yyyy-MM-dd',
            json: false,
            timestamp: false
        })
    ],
    exitOnError: false
});

module.exports = {
    info: webLogger.info,
    warn: webLogger.warn,
    error: function(){
        webLogger.error.apply(webLogger, arguments);
        errorLogger.error.apply(errorLogger, arguments);
    },
    stream: {
        write: function(msg){
            accessLogger.log('silly', msg.trim())
        }
    }
};
