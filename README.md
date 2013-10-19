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

## 开源实践
 * https://github.com/isaacs/node-supervisor
 * https://github.com/nodejitsu/forever
 * https://github.com/mnutt/hummingbird
 * https://github.com/NarrativeScience/Log.io
 * https://github.com/isaacs/nave
 * https://github.com/flatiron/winston


