## 手写实现vue2.0版本

### 第一步，数据劫持

通过`Object.defineProperty`来实现对数据的读写操作劫持

* 对象需要递归遍历所有的层级数据，以对多层嵌套数据的劫持
* 数组需要重写变异方法，并对增加的数据进行劫持
* 修改数据时，对修改后的值也需要进行劫持