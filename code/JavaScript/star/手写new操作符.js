// constructor 是对象的一个属性，指向创建该对象的构造函数
// ...args是JavaScript里面的剩余参数，允许函数接收不定数量的参数并把它们收集到一个数组里面，
// 必须是函数参数列表的最后一个参数

function myNew(Constructor,...args) {
    // 1，创建空对象
    const newObj = {};

    // 2，链接到原型链
    newObj.__proto__ = Constructor.prototype;
    // 等价于：Object.setPrototypeOf(newObj,Constructor.prototype);

    // 3，绑定this并执行构造函数
    // apply是函数对象的一个方法，用于调用函数并控制函数执行时的this值，
    // 这段代码的作用是调用构造函数并将this绑定到新创建的对象newObj上面
    // 同时将args数组中的元素作为参数传递给构造函数
    // 这一步是实现new操作符核心功能的关键，确保构造函数中的this指向新创建的实例

    // result其实是构造函数的返回值，应该在构造函数里面。result就是构造函数的返回值
    // 如果构造函数没有返回值或者返回的是一个非对象值（如基本类型），
    // 则 new 表达式的结果将是新创建的对象 newObj
    // 如果构造函数返回的是一个对象，那么 new 表达式的结果将是这个对象
    const result = Constructor.apply(newObj,args);
    // 4，返回新对象
    return result instanceof Object ? result : newObj;
}

// 定义构造函数
function Person(name, age) {
  // 步骤3：this指向新对象，给新对象添加属性
  this.name = name;
  this.age = age;
  
  // 假设构造函数有返回值（后续会测试不同返回值的影响）
  // return { gender: 'male' }; // 若返回对象，instance会是这个对象
  // return 123; // 若返回基本类型，instance仍是新对象
}

// 原型上的方法（步骤2会让实例继承这些）
Person.prototype.sayHi = function() {
  console.log(`Hi, I'm ${this.name}`);
};


// 测试：用myNew创建实例
const person2 = myNew(Person,'李四',22);
console.log(person2.name);
person2.sayHi();
console.log(person2 instanceof Person);