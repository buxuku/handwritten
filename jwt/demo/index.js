
const http = require('http');
const querystring = require('querystring');
const jwt = require('../index');
const secret = 'lxd';

const server = http.createServer((req, res)=> {
    if(req.url === '/login'){
        const contentType = req.headers['content-type'];
        let arr = [];
        req.on('data',function(chunk){
            arr.push(chunk);
        })
        req.on('end', function(){
            const body = Buffer.concat(arr).toString();
            let data;
            if(contentType === 'application/x-www-form-urlencoded'){
                data = querystring(body);
            }
            if(contentType === 'application/json'){
                data = JSON.parse(body);
            }
            const { name, password } = data || {};
            if(name === 'lxd' && password === 123456){
                res.end(JSON.stringify({
                    message: 'login success',
                    // token格式： 头.内容.密钥
                    token: jwt.encode({
                        exp: new Date(Date.now() + 30 * 1000),
                        name: 'lxd',
                    }, secret)
                }))
            }else{
                res.end('login error');
            }
        })
    }
    if(req.url === '/check'){
        console.log('headers', req.headers);
        const authorization = req.headers['authorization'];
        if(authorization){
            try{
                const payload = jwt.decode(authorization, secret);
                let exp = new Date(payload.exp).getTime();
                if(exp < new Date().getTime()){
                    res.end('token expires')
                }else{
                   res.end('login ok')
                }
            }catch(err){
                console.log('error', err);
                res.end('auth error')
            }

        }else{
            res.end();
        }
    }
})
server.listen(4000);