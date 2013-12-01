module.exports = function (server) {
    server.get('/', function (req, res, next) {
        res.send('hello world')
    });
};
