import { initState } from "./initState";
import { compileToFunction } from "./compile/index";

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this;
    vm.$options = options; //用户传入的属性全部挂载到$开头下面
    initState(vm);
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
  Vue.prototype.$mount = function(el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);
    if (!options.render) {
      let template = vm.$options.template;
      if (!template && el) {
        template = el.outerHTML;
        let render = compileToFunction(template);
        options.render = render;
      }
    }
  };
}
