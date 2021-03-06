Ning
====

Node.js Web Application Driver

[中文](./README_ZH.md)

## Getting start

### Install

```sh
$ npm install
npm http GET https://registry.npmjs.org/express/3.4.2
npm http 200 https://registry.npmjs.org/express/3.4.2
...
express@3.4.2 node_modules/express
├── methods@0.0.1
├── range-parser@0.0.4
├── cookie-signature@1.0.1
├── fresh@0.2.0
├── debug@0.7.3
├── buffer-crc32@0.2.1
├── cookie@0.1.0
├── mkdirp@0.3.5
├── commander@1.3.2 (keypress@0.1.0)
├── send@0.1.4 (mime@1.2.11)
└── connect@2.9.2 (uid2@0.0.2, pause@0.0.1, raw-body@0.0.3, qs@0.6.5, bytes@0.2.0, negotiator@0.2.8, multiparty@2.2.0)
```

### Start

```sh
$ npm start
2013-11-03T17:20:07.000Z web.1  | 'node index.js' started with pid 2843
2013-11-03T17:20:07.691Z Master 2843    | Worker 2849 listening 0.0.0.0:80
2013-11-03T17:20:07.693Z Master 2843    | Worker 2850 listening 0.0.0.0:80
2013-11-03T17:20:07.693Z Master 2843    | Worker 2848 listening 0.0.0.0:80
2013-11-03T17:20:07.693Z Master 2843    | Worker 2847 listening 0.0.0.0:80
```

It's work?

```sh
$ curl 0.0.0.0/cgi-bin/hello
hello world
```

### Restart

```sh
$ npm restart
2013-11-03T17:22:22.796Z Master 2843    | Got SIGHUP signal, restarting workers
2013-11-03T17:22:22.796Z Master 2843    | Killing worker 2847
2013-11-03T17:22:22.800Z Worker 2847    | Received kill signal, shutting down gracefully
2013-11-03T17:22:22.802Z Worker 2847    | Closed out remaining connections
2013-11-03T17:22:22.805Z Master 2843    | Worker 2847 shutdown complete
2013-11-03T17:22:22.807Z Master 2843    | Worker 2847 was just suicide
2013-11-03T17:22:22.930Z Master 2843    | Replacement worker 2870 online
2013-11-03T17:22:22.930Z Master 2843    | Killing worker 2848
2013-11-03T17:22:22.931Z Master 2843    | Worker 2870 listening 0.0.0.0:80
2013-11-03T17:22:22.933Z Worker 2848    | Received kill signal, shutting down gracefully
2013-11-03T17:22:22.934Z Worker 2848    | Closed out remaining connections
2013-11-03T17:22:22.937Z Master 2843    | Worker 2848 shutdown complete
2013-11-03T17:22:22.938Z Master 2843    | Worker 2848 was just suicide
2013-11-03T17:22:23.049Z Master 2843    | Replacement worker 2871 online
2013-11-03T17:22:23.049Z Master 2843    | Killing worker 2849
2013-11-03T17:22:23.049Z Master 2843    | Worker 2871 listening 0.0.0.0:80
2013-11-03T17:22:23.052Z Worker 2849    | Received kill signal, shutting down gracefully
2013-11-03T17:22:23.054Z Worker 2849    | Closed out remaining connections
2013-11-03T17:22:23.059Z Master 2843    | Worker 2849 shutdown complete
2013-11-03T17:22:23.062Z Master 2843    | Worker 2849 was just suicide
2013-11-03T17:22:23.170Z Master 2843    | Replacement worker 2872 online
2013-11-03T17:22:23.170Z Master 2843    | Killing worker 2850
2013-11-03T17:22:23.170Z Master 2843    | Worker 2872 listening 0.0.0.0:80
2013-11-03T17:22:23.172Z Worker 2850    | Received kill signal, shutting down gracefully
2013-11-03T17:22:23.174Z Worker 2850    | Closed out remaining connections
2013-11-03T17:22:23.176Z Master 2843    | Worker 2850 shutdown complete
2013-11-03T17:22:23.178Z Master 2843    | Worker 2850 was just suicide
2013-11-03T17:22:23.301Z Master 2843    | Replacement worker 2873 online
2013-11-03T17:22:23.301Z Master 2843    | Workers success restarted
2013-11-03T17:22:23.301Z Master 2843    | Worker 2873 listening 0.0.0.0:80
```

### Stop

```sh
$ npm stop
2013-11-03T17:23:29.104Z Master 2843    | Got SIGQUIT signal, killing master and workers
2013-11-03T17:23:29.104Z Master 2843    | Killing worker 2870
2013-11-03T17:23:29.107Z Worker 2870    | Received kill signal, shutting down gracefully
2013-11-03T17:23:29.109Z Worker 2870    | Closed out remaining connections
2013-11-03T17:23:29.112Z Master 2843    | Worker 2870 shutdown complete
2013-11-03T17:23:29.112Z Master 2843    | Killing worker 2871
2013-11-03T17:23:29.112Z Master 2843    | Worker 2870 was just suicide
2013-11-03T17:23:29.115Z Worker 2871    | Received kill signal, shutting down gracefully
2013-11-03T17:23:29.118Z Worker 2871    | Closed out remaining connections
2013-11-03T17:23:29.122Z Master 2843    | Worker 2871 shutdown complete
2013-11-03T17:23:29.122Z Master 2843    | Killing worker 2872
2013-11-03T17:23:29.123Z Master 2843    | Worker 2871 was just suicide
2013-11-03T17:23:29.126Z Worker 2872    | Received kill signal, shutting down gracefully
2013-11-03T17:23:29.129Z Worker 2872    | Closed out remaining connections
2013-11-03T17:23:29.135Z Master 2843    | Worker 2872 shutdown complete
2013-11-03T17:23:29.135Z Master 2843    | Killing worker 2873
2013-11-03T17:23:29.135Z Master 2843    | Worker 2872 was just suicide
2013-11-03T17:23:29.138Z Worker 2873    | Received kill signal, shutting down gracefully
2013-11-03T17:23:29.140Z Worker 2873    | Closed out remaining connections
2013-11-03T17:23:29.143Z Master 2843    | Worker 2873 shutdown complete
2013-11-03T17:23:29.148Z Master 2843    | Workers success killed
SIGINT received
sending SIGTERM to all processes
```

## License

The MIT License (MIT)

Copyright (c) 2013 yuanyan.cao@gmail.com
