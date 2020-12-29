import {initState} from "./initState";


export  function initMixin(Vue){
    Vue.prototype._init = function(options){
        const vm = this;
        vm.$options = options; //用户传入的属性全部挂载到$开头下面
        initState(vm);
    }
}