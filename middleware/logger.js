var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.DailyRotateFile)({
            filename: path.join(__dirname, '..', 'logs', 'log'),
            datePattern: '.yyyy-MM-dd'
        })
    ]
});

module.exports = logger;
