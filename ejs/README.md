一个ejs模板文件大概是这个样子

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <ul>
        <%dirs.forEach(item=>{%>
            <li><a href="<%=item.pathname%>"><%=item.name%></a></li>
        <%})%>
    </ul>
</body>
</html>
```

## 解析思路

* 对于变量类型的通过正则匹配，替换成对应的值
* 对于js语法的，比如循环操作，把`<%%>`替换掉，当成js代码块，把前后的片段进行分割
* 最后通过`new Function`的方式来执行该字符串
* 利用`with`语句来获取外部传入的变量

比如对于上面的文件内容，我们可以解析成字符串

```js
let html='';
with(obj){
html += `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <ul>
        `
dirs.forEach(item=>{
html+=`
            <li><a href="${item.pathname}">${item.name}</a></li>
        `
})
html+=`
    </ul>
</body>
</html>`}
```

然后通过`new Function`的方式来执行该字符串即可。

```js
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
        console.log('content', template);
        let fn = new Function('obj', template);
        return fn(data);
    }
}
module.exports = ejs;
```



### 额外知识点

* 正则的惰性匹配 `+?`