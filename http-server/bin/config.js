const config = {
    'port': {
        options: '-p, --port <n>',
        descriptor: 'set custom port, default: 8080',
        default: 8080,
        usage: 'lxd-server --port <n>'
    },
    'directory': {
        options: '-d,--directory <n>',
        descriptor: 'set custom directory, default: process.cwd()',
        default:process.cwd(),
        usage: 'lxd-server --directory <n>'
    },
    'cache':{
        options: '-c,--cache <n>',
        descriptor: 'set cache control, default: no-cache',
        default: 'no-cache',
        usage: 'lxd-server --cache <n>'
    }
}
module.exports = config;
