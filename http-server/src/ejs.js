const fs = require('fs').promises;

let ejs = {
    async renderFile(templateUrl, data) {
        let content = await fs.readFile(templateUrl, 'utf8');
        let head = `let html='';\r\nwith(obj){\r\n`;
        head += 'html += `';
        content = content.replace(/<%=(.+?)%>/g, function () {
            return '${' + arguments[1] + '}';
        });
        let body = content.replace(/<%(.+?)%>/g, function () {
            return '`\r\n' + arguments[1] + '\r\nhtml+=`';
        })
        let tail = '`}\r\nreturn html;';
        let template = head + body + tail;
        let fn = new Function('obj', template);
        return fn(data);
    }
}
module.exports = ejs;
