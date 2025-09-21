// JavaScript 中操作 this 指向的三种方法：call、apply、bind

// 一、call 方法的实现
/**
 * call 方法模拟实现
 * @param {*} context - 要绑定的 this 值
 * @param {...*} args - 传递给函数的参数列表
 * @returns {*} - 函数执行的结果
 */
Function.prototype.myCall = function(context) {
    // 如果没有提供 context 或 context 为 null/undefined，则默认指向 window/global
    context = context || window;
    
    // 创建一个唯一的属性名，避免覆盖原有属性
    const fnSymbol = Symbol('fn');
    
    // 将调用 myCall 的函数（即 this）赋值给 context 的 fnSymbol 属性
    context[fnSymbol] = this;
    
    // 获取除了第一个参数之外的其他参数
    const args = [];
    for (let i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    
    // 调用函数，此时函数内的 this 指向 context
    const result = context[fnSymbol](...args);
    
    // 删除临时属性，保持对象的纯净性
    delete context[fnSymbol];
    
    // 返回函数执行结果
    return result;
};

// 二、apply 方法的实现
/**
 * apply 方法模拟实现
 * @param {*} context - 要绑定的 this 值
 * @param {Array} argsArray - 传递给函数的参数数组
 * @returns {*} - 函数执行的结果
 */
Function.prototype.myApply = function(context, argsArray) {
    // 如果没有提供 context 或 context 为 null/undefined，则默认指向 window/global
    context = context || window;
    
    // 创建一个唯一的属性名，避免覆盖原有属性
    const fnSymbol = Symbol('fn');
    
    // 将调用 myApply 的函数（即 this）赋值给 context 的 fnSymbol 属性
    context[fnSymbol] = this;
    
    // 调用函数，此时函数内的 this 指向 context
    let result;
    if (argsArray && Array.isArray(argsArray)) {
        result = context[fnSymbol](...argsArray);
    } else {
        result = context[fnSymbol]();
    }
    
    // 删除临时属性，保持对象的纯净性
    delete context[fnSymbol];
    
    // 返回函数执行结果
    return result;
};

// 三、bind 方法的实现
/**
 * bind 方法模拟实现
 * @param {*} context - 要绑定的 this 值
 * @param {...*} args - 预先绑定的参数
 * @returns {Function} - 新的绑定函数
 */
Function.prototype.myBind = function(context) {
    // 保存原函数引用
    const self = this;
    
    // 获取除了第一个参数之外的其他参数（预绑定参数）
    const bindArgs = Array.prototype.slice.call(arguments, 1);
    
    // 创建并返回新函数
    const bound = function() {
        // 获取调用新函数时传递的参数
        const callArgs = Array.prototype.slice.call(arguments);
        
        // 如果是作为构造函数调用（使用 new 关键字），则 this 指向实例
        // 否则 this 指向传入的 context
        return self.apply(
            this instanceof bound ? this : context,
            bindArgs.concat(callArgs)
        );
    };
    
    // 维护原型链
    // 创建一个空函数作为中介，避免直接修改 bound.prototype 影响原函数的原型
    function Fn() {};
    Fn.prototype = self.prototype;
    bound.prototype = new Fn();
    
    return bound;
};

// 使用示例
// 1. call 方法示例
const person1 = {
    name: '张三',
    age: 30
};

function sayHello(greeting, punctuation) {
    console.log(`${greeting}, ${this.name}!${punctuation}`);
    console.log(`您今年 ${this.age} 岁`);
}

sayHello.myCall(person1, '你好', '！');

// 2. apply 方法示例
const person2 = {
    name: '李四',
    age: 25
};

sayHello.myApply(person2, ['嗨', '～']);

// 3. bind 方法示例
const person3 = {
    name: '王五',
    age: 40
};

const greetWang = sayHello.myBind(person3, '您好');
greetWang('。');

// 测试 bind 方法的构造函数特性
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.sayName = function() {
    console.log(`我的名字是 ${this.name}`);
};

const BoundPerson = Person.myBind({});
const instance = new BoundPerson('赵六', 35);
instance.sayName(); // 应该输出: 我的名字是 赵六