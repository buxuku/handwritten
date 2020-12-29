/**
 * 对array的变异方法进行重写，以实现array数组的修改劫持功能
 * @type {*[]}
 */
let oldArrayPrototype = Array.prototype;
export let arrayMethods = Object.create(oldArrayPrototype);

const methods = [ // array的七个变异方法，会改变原数据
    'push',
    'shift',
    'unshift',
    'pop',
    'reverse',
    'sort',
    'splice',
]
methods.forEach(method=>{
    arrayMethods[method] = function(...args){
        oldArrayPrototype[method].call(this, ...args); // oldArrayPrototype是原来Array上面的方法，所以需要改变this指向具体操作的数组
        let ob = this.__ob__;
        let inserted;
        switch(method){
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
            default:
                break;
        }
        if(inserted) ob.observerArray(inserted); //对新增的数据需要进行劫持
    }
})