// Workers can share any TCP connection
var config = require(process.env.CONFIGFILE || './config');
var webConfig = config.web;
var path = require('path');
var fs = require('fs');
var assert = require('assert');
var node_modules = config.node_modules;
if(node_modules) {
    node_modules = [].concat(node_modules).map(function(p){
        return path.resolve(p)
    });
    module.paths = module.paths.concat(node_modules);
}

var app_modules = webConfig.app_modules;
if(app_modules) {
    app_modules = [].concat(app_modules).map(function(p){
        return path.resolve(p)
    });
    module.paths = module.paths.concat(app_modules);
}

var express = require('express');
var app = express();
var logger = require('logger');
var info = logger.info;
var pid = process.pid;
var production = 'production' == app.settings.env;

// general config
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// disable them in production
// use $ NODE_ENV=production node examples/error-pages
if (production) {
    app.disable('verbose errors');
    app.use(express.logger({stream: logger.stream}));
}else{
    // our custom "verbose errors" setting
    // which we can use in the templates
    // via settings['verbose errors']
    app.enable('verbose errors');
    app.use(express.logger('dev'));
}

app.use(express.favicon());

function scanRoutes(file, routes) {
    routes = routes || [];
    file = path.resolve(file);
    assert.ok(fs.existsSync(file), 'Route directory not found. (\'' + file + '\')');

    var stats = fs.statSync(file);
    if (stats.isDirectory())  {
        fs.readdirSync(file).forEach(function (child) {
            scanRoutes(path.join(file, child), routes);
        });
    } else if (stats.isFile()) {
        routes.push(file);
    }
    return routes;
}

var routes = scanRoutes(webConfig.routes.path);

if (webConfig.routes.filter) {
    var filter = webConfig.routes.filter;
    routes = routes.filter(function(file){
        try {
            if (typeof filter === 'function') {
                return filter(file);
            } else if (typeof filter.test === 'function'){
                return filter.test(file);
            }else {
                assert.ok(false, 'Route filter type should be Function or Regexp.');
            }
        } catch(e) {
            // Otherwise, it's probably not the right type.
            return false;
        }
    });
}

routes.forEach(function (file) {
    var controller = require(file);
    if (typeof controller === 'function' && controller.length === 1) {
        controller(app);
    }
});

// "app.router" positions our routes
// above the middleware defined below,
// this means that Express will attempt
// to match & call routes _before_ continuing
// on, at which point we assume it's a 404 because
// no route has handled the request.

app.use(app.router);

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.

// $ curl http://localhost:3000/notfound
// $ curl http://localhost:3000/notfound -H "Accept: application/json"
// $ curl http://localhost:3000/notfound -H "Accept: text/plain"

app.use(function(req, res, next){
    res.status(404);
    res.send('Not found');
});

// error-handling middleware, take the same form
// as regular middleware, however they require an
// arity of 4, aka the signature (err, req, res, next).
// when connect has an error, it will invoke ONLY error-handling
// middleware.

// If we were to next() here any remaining non-error-handling
// middleware would then be executed, or if we next(err) to
// continue passing the error, only error-handling middleware
// would remain being executed, however here
// we simply respond with an error page.

app.use(function(err, req, res, next){
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    res.status(err.status || 500);
    res.send('Error');
});

app.get('/404', function(req, res, next){
    // trigger a 404 since no other middleware
    // will match /404 after this one, and we're not
    // responding here
    next();
});

process.on('message', function(msg) {
    if(msg === 'shutdown') {
        info("Received kill signal, shutting down gracefully");
        server.close(function() {
            info("Closed out remaining connections");
            process.exit(0)
        });
        // Normally below code should no opportunity to execution
        setTimeout(function() {
            info("Could not close connections in time, forcefully shutting down");
            process.exit()
        }, 2000);
    }
})

var server = app.listen(webConfig.http.port, webConfig.http.hostname, webConfig.http.backlog)
