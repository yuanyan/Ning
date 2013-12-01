module.exports = {
    node_modules: ['./service'],
    // Defines the number of worker processes.
    // The value “auto” will try to autodetect it.
    worker_processes: 'auto',
    error_log: {
        path: 'logs/error.log',
        format: 'combined',
        level: 'error'
    },
    web: {
        app: './web/app.js',
        // See http://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback
        http: {
            port: 3000
            // hostname: undefined,
            // backlog: undefined,
        },
        routes: {
            // The directory to scan
            path: "./web/routes/",
            // Either a regexp or a function that is passed the matched route file and returns true or false
            filter: /\.js$/i
        },
        access_log: {
            path: 'logs/access.log',
            format: 'combined'
        }
    }
}