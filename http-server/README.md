## 手写实现一个简单的http-server服务

利用node原生的http模块来启动一个http服务，支持以下API

```shell
Options:
  -p, --port <n>      set custom port, default: 8080
  -d,--directory <n>  set custom directory, default: process.cwd()
  -c,--cache <n>      set cache control, default: no-cache
  -h, --help          display help for command
```

## 核心思路

* 通过`commander`模板来解析命令参数
* 通过`http`模板来启动一个`http-server`服务
* 监听请求，对请求路径进行解析，获取到要请求的文件路径
* 如果请求的是文件，利用`fs`模块读取文件并输出
* 如果是文件夹，读取文件夹下面的文件及文件夹，通过`ejs`来渲染一个文件列表页 [手写实现简单的ejs模板解析](../ejs/)
* 在输出文件的时候，利用`mime`模块读取出文件的类型，输出正确的`Content-Type`;
* 通过读取文件的创建时间来设置`Last-Modified`
* 利用`crypto`模块对文件内容生成`Etag`来进行缓存
