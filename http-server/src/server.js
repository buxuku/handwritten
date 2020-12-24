const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs').promises;
const {createReadStream, createWriteStream, readFileSync} = require('fs');
const crypto = require('crypto');
const chalk = require('chalk');
const ejs = require('./ejs');
const mime = require('mime');

class Server {
    constructor(options) {
        const {port, directory, cache} = options;
        this.port = port;
        this.directory = directory;
        this.cache = cache;
    }

    async handleRequest(req, res) {
        try {
            let {pathname} = url.parse(req.url);
            pathname = decodeURIComponent(pathname);
            const requestUrl = path.join(this.directory, pathname);
            const statObj = await fs.stat(requestUrl);
            if (statObj.isDirectory()) { // 如果是目录，读取目录下的文件夹及文件，通过ejs渲染目录列表模板进行输出
                let dirs = await fs.readdir(requestUrl);
                dirs = dirs.map(item =>({pathname: path.join(pathname, item), name: item}));
                const content = await ejs.renderFile(path.resolve(__dirname, 'dirs.html'), {dirs});
                res.setHeader('Content-Type', `text/html;charset=utf-8`);
                res.end(content);
            } else {
                this.sendFile(requestUrl, req, res, statObj);
            }
        } catch (e) {
            console.log('end', e);
            this.sendError(req, res);
        }
    }
    // 通过Etag和Last-Modified对文件设置缓存
    catchFile(filePath, req, res, stat){
        if(this.cache === 'no-cache'){
            return false;
        }
        res.setHeader('Cache-Control', this.cache);
        const ctime = stat.ctime.toUTCString();
        const etag = crypto.createHash('md5').update(readFileSync(filePath)).digest('base64');
        res.setHeader('Last-Modified', ctime);
        res.setHeader('Etag', etag);
        return ctime === req.headers['if-modified-since'] && etag === req.headers['if-none-match'];
    }
    sendFile(filePath, req, res, stat) {
        if(this.catchFile(filePath, req, res, stat)){
            res.statusCode = 304;
            return res.end();
        }
        res.setHeader('Content-Type', `${mime.getType(filePath)};charset=utf-8`);
        createReadStream(filePath).pipe(res);
    }
    sendError(req, res){
        res.statusCode = 404;
        res.end('Not Found!');
    }

    start() {
        const server = http.createServer((req, res) => this.handleRequest(req, res));
        server.listen(this.port, () => {
            console.log(`server start at http://127.0.0.1:${chalk.green(this.port)} `)
        })
    }
}

module.exports = Server;