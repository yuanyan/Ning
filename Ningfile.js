module.exports = {
    // See http://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback
    http_port: 3000,
    // http_hostname: undefined,
    // http_backlog: undefined,
    http_error_page: {
        404: "404.html"
    },
    node_modules: ['app_modules'],
    // Defines the number of worker processes.
    // The value “auto” will try to autodetect it.
    worker_processes: 'auto',
    access_log: {
        path: 'logs/access.log',
        format: 'combined'
    },
    error_log: {
        path: 'logs/error.log',
        format: 'combined',
        level: 'error'
    }
}