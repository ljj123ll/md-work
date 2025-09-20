// 1. 定义构造函数
function Person(name) {
  this.name = name; // 实例自身属性（每个实例独立）
}

// 2. 向原型对象添加共享方法（所有实例共享）
Person.prototype.sayHello = function() {
  console.log(`Hello, ${this.name}`);
};

// 3. 创建实例
const p1 = new Person("Alice");
const p2 = new Person("Bob");

// 4. 三角关系验证
// 实例的 __proto__ 指向构造函数的原型对象（prototype）
// 原型对象的constructor指向构造函数，实例通过原型链访问constructor
console.log(p1.__proto__ === Person.prototype); // true（实例的__proto__指向构造函数的prototype）
console.log(Person.prototype.constructor === Person); // true（原型的constructor指向构造函数）
console.log(p1.constructor === Person); // true（实例通过原型链继承constructor）

// 5. 共享原型方法
p1.sayHello(); // "Hello, Alice"
p2.sayHello(); // "Hello, Bob"


//原型的工作机制：
// 原型的一个重要作用就是实现属性和方法的共享，从而节省内存空间，
// 属性查找机制:当访问对象的属性或者方法时，js会按照一下顺序查找：
// 先在自身对象查找，再通过__proto__查找，继续向上查找到Object.prototype,最终没找到返回undefined
// ### 为什么使用原型？
// 原型机制在JavaScript中有几个重要作用：

// 1. 
//    内存优化 ：共享方法和属性，避免为每个实例重复创建相同的函数
// 2. 
//    实现继承 ：通过原型链实现对象间的继承关系
// 3. 
//    动态扩展 ：可以在运行时向原型添加属性和方法，所有实例都会自动获得这些新增的特性