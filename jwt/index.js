const jwt = {
    sign(content, secret){
      return this.base64UrlEscpe(require('crypto').createHmac('sha256',secret).update(content).digest('base64'))
    },
    base64(value){
        return this.base64UrlEscpe(Buffer.from(JSON.stringify(value)).toString('base64'));
    },
    base64UrlEscpe(value){
        return value.replace(/\+/g, '-').replace(/\=/g, '').replace(/\//g, '_');
    },
    encode(content, secret){
        let header = this.base64({type: 'JWT', alg: 'HS256'});
        let body = this.base64(content);
        let sign = this.sign(header + '.' + body, secret);
        return header + '.' + body + '.' + sign;
    },
    base64UrlUnEscpe(value){
        value += new Array(5 - value.length % 4).join('=');
        return value.replace(/\-/g, '+').replace(/_/g, '/');
    },
    decode(content, secret) {
        const [header, body, sign] = content.split('.');
        console.log('test', header, body, content );
        let newSign = this.sign(header + '.' + body, secret);
        if(sign === newSign){
            return JSON.parse(Buffer.from(this.base64UrlUnEscpe(body), 'base64').toString());
        }else{
            throw new Error('tooken error');
        }
    }
}
module.exports = jwt;
