/**
 * 对数据进行劫持观测，如果是对象，不断递归，遍历对象所有的层级进行劫持
 * 对数组类型的重写原生数组的变异方法，并对数组内的非基本数据类型再次进行劫持
 */
import { isObject } from "../utils";
import { arrayMethods } from "./array";

function defineReactive(data, key, value) {
  observer(value); // value是一个对象，需要递归进行劫持，所以性能也差
  Object.defineProperty(data, key, {
    get() {
      return value;
    },
    set(newValue) {
      value = newValue;
      observer(newValue); // newValue可能是一个对象，也需要进行劫持
    }
  });
}

// 类有类型，对象无类型，用类的方法来实现可以判断出数据是否是该类的实例
class Observer {
  constructor(data) {
    console.log("data", data);
    Object.defineProperty(data, "__ob__", {
      value: this,
      enumerable: false // 不可被枚举
    });
    // data.__ob__ = this; //直接挂载到data上面会在后面递归中被枚举出来，造成死循环
    if (Array.isArray(data)) {
      // 处理data是数组的情况，避免每个item都生成get和set方法
      data.__proto__ = arrayMethods; //只有被劫持的数组才会被重写操作方法，其它地方的数组不会受影响。
      this.observerArray(data);
    } else {
      this.walk(data);
    }
  }

  observerArray(data) {
    // 对数组中的对象进行劫持
    data.forEach(item => observer(item));
  }

  walk(data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key]);
    });
  }
}

export function observer(data) {
  if (!isObject(data)) {
    return; // vue中只对对象类型的数据进行劫持
  }
  if (data.__ob__) {
    return; //如果数据已经被劫持过了，就无需再次进行劫持操作 ?什么情况下会出现
  }
  return new Observer(data);
}
