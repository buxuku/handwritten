import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default{
    input: './index.js',
    output: {
        format: 'umd',
        file: 'dist/umd/vue.js',
        name: 'Vue',
        sourcemap:true,
    },
    plugins: [
        babel({ // 使用babel进行格式化，并且排除node_modules目录
            exclude: '/node_modules/**',
        })
    ]
}