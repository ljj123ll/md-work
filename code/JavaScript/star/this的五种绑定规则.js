// 全局/普通函数调用：this指向全局对象
function globalCall() {
    console.log(this == window);
}
globalCall(); // true

const obj1 = {
    fn: function () {
        function innerFn() {
            console.log(this === window);
        }
        innerFn();
    }
};
obj1.fn();

// 严格模式
"use strict";
function strictCall() {
    console.log(this);
}
strictCall(); // undefined

// 2,对象方法调用
const obj2 = {
    name:"对象方法",
    say() {
        console.log(this.name);
    },
    child: {
        name:"子对象",
        say() {
            console.log(this.name);
        }
    }
};
obj2.say(); // 对象方法
obj2.child.say(); // 子对象