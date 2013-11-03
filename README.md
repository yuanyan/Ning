Ning
====

面向海量用户的`Node.js`工业级基础服务框架

## 特性
1. 负载服务集成
  * LVS分发请求
  * HAProxy（负载均衡、过载保护、容灾）
2. 发布部署策略
  * 自动回滚策略
  * 增量部署策略
  * 热部署策略
3. 单机多核策略
4. 单机内存策略
5. `Redis`缓存服务集成
6. `Express.js`集成
7. 异常处理
8. 实时监控与报警
  * CPU使用率（用户态、内核态、IOWait等）
  * CPU负载
  * 内存使用率
  * 磁盘空间使用率
  * 网络并发请求量
  * 未捕获异常
  * 服务可用状态（可通过Web前端来监控）
9. 日志服务
  * 访问日志
  * 错误日志
  * 业务日志
10. Node.js版本升级策略
  * 版本推荐 >=0.10.21 <0.11
  * [0.10.*版本相关更新](http://www.joyent.com/blog/announcing-the-latest-node-update)
11. 配置化驱动服务
  * `Ningfile`配置文件驱动
  * `package.json`配置文件驱动模块依赖管理

## 开始

安装依赖包
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

启动
```sh
$ sudo sh ./proc.sh ./bin/start.proc
2013-11-03T11:15:04.000Z web.1  | 'node index.js' started with pid 1702
2013-11-03T11:15:05.058Z 1702   | worker 1706 listening 0.0.0.0:80
2013-11-03T11:15:05.068Z 1702   | worker 1707 listening 0.0.0.0:80
2013-11-03T11:15:05.074Z 1702   | worker 1708 listening 0.0.0.0:80
2013-11-03T11:15:05.080Z 1702   | worker 1709 listening 0.0.0.0:80
```
测试
```
$ curl 0.0.0.0/cgi-bin/hello
hello world
```

## 开源实践
 * https://github.com/isaacs/node-supervisor
 * https://github.com/nodejitsu/forever
 * https://github.com/mnutt/hummingbird
 * https://github.com/NarrativeScience/Log.io
 * https://github.com/isaacs/nave
 * https://github.com/flatiron/winston

## 版权协议
The MIT License (MIT)
Copyright (c) 2013 yuanyan.cao@gmail.com


