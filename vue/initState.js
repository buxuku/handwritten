import {isFunction} from "./utils";
import {observer} from "./observer/index.js";

export function initState(vm){
    const opts = vm.$options;
    if(opts.data){
        initData(vm);
    }
}

function initData(vm){
    let {data} = vm.$options;
    data = vm._data = isFunction(data) ? data.call(vm) : data; // data和vm._data引用同一内容空间

    observer(data);

}