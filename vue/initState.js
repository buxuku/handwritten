import { isFunction } from "./utils";
import { observer } from "./observer/index.js";

export function initState(vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
}
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newValue) {
      vm[source][key] = newValue;
    }
  });
}
function initData(vm) {
  let { data } = vm.$options;
  data = vm._data = isFunction(data) ? data.call(vm) : data; // data和vm._data引用同一内容空间
  for (let key in data) {
    proxy(vm, "_data", key); // 将_data上面的数据全部代理给vm上
  }
  observer(data);
}
