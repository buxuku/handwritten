(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

    function isFunction(value) {
      return typeof value === 'function';
    }
    function isObject(data) {
      return typeof data === 'object' && data !== null;
    }

    /**
     * 对array的变异方法进行重写，以实现array数组的修改劫持功能
     * @type {*[]}
     */
    let oldArrayPrototype = Array.prototype;
    let arrayMethods = Object.create(oldArrayPrototype);
    const methods = [// array的七个变异方法，会改变原数据
    'push', 'shift', 'unshift', 'pop', 'reverse', 'sort', 'splice'];
    methods.forEach(method => {
      arrayMethods[method] = function (...args) {
        oldArrayPrototype[method].call(this, ...args); // oldArrayPrototype是原来Array上面的方法，所以需要改变this指向具体操作的数组

        let ob = this.__ob__;
        let inserted;

        switch (method) {
          case 'push':
          case 'unshift':
            inserted = args;
            break;

          case 'splice':
            inserted = args.slice(2);
            break;
        }

        if (inserted) ob.observerArray(inserted); //对新增的数据需要进行劫持
      };
    });

    /**
     * 对数据进行劫持观测，如果是对象，不断递归，遍历对象所有的层级进行劫持
     * 对数组类型的重写原生数组的变异方法，并对数组内的非基本数据类型再次进行劫持
     */

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
    } // 类有类型，对象无类型，用类的方法来实现可以判断出数据是否是该类的实例


    class Observer {
      constructor(data) {
        console.log("data", data);
        Object.defineProperty(data, "__ob__", {
          value: this,
          enumerable: false // 不可被枚举

        }); // data.__ob__ = this; //直接挂载到data上面会在后面递归中被枚举出来，造成死循环

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

    function observer(data) {
      if (!isObject(data)) {
        return; // vue中只对对象类型的数据进行劫持
      }

      if (data.__ob__) {
        return; //如果数据已经被劫持过了，就无需再次进行劫持操作 ?什么情况下会出现
      }

      return new Observer(data);
    }

    function initState(vm) {
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
      let {
        data
      } = vm.$options;
      data = vm._data = isFunction(data) ? data.call(vm) : data; // data和vm._data引用同一内容空间

      for (let key in data) {
        proxy(vm, "_data", key); // 将_data上面的数据全部代理给vm上
      }

      observer(data);
    }

    function compileToFunction(template) {
      console.log('template', template);
    }

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options; //用户传入的属性全部挂载到$开头下面

        initState(vm);

        if (vm.$options.el) {
          vm.$mount(vm.$options.el);
        }
      };

      Vue.prototype.$mount = function (el) {
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

    function Vue(options) {
      this._init(options);
    }

    initMixin(Vue);

    return Vue;

})));
//# sourceMappingURL=vue.js.map
