// 父类：动物
function Animal(name) {
  this.name = name;
  this.features = ["有生命", "能运动"];
}

Animal.prototype.eat = function() {
  console.log(`${this.name}在吃东西`);
};

// 子类：狗
function Dog(name) {
  // 1. 构造函数继承：继承实例属性（仅调用一次父类构造函数）
  Animal.call(this, name); 
}

// 2. 寄生式继承父类原型（核心：避免调用父类构造函数）
// 2.1 创建空函数作为中介
const F = function() {}; 
F.prototype = Animal.prototype; // 空函数原型指向父类原型
// 2.2 子类原型指向空函数实例（间接继承父类原型）
Dog.prototype = new F(); 
// 2.3 修复 constructor
Dog.prototype.constructor = Dog;

// 测试
const dog = new Dog("阿黄");
dog.eat(); // 阿黄在吃东西（继承原型方法）
console.log(dog.features); // ["有生命", "能运动"]（实例属性独立）