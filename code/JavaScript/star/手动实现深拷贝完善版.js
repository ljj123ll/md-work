// 此方法递归遍历对象或者数组，对基本类型直接返回，对引用类型新建对应结构，再递归调用深拷贝函数
// 在基础版之上补充了循环引用处理和特殊类型（Data/Symbol/Map/Set）的处理
// 用WeakMap存储已拷贝的对象，解决循环引用的问题
// 用Object.prototype.toString().call()精准判断特殊类型
// 针对不同特殊类型，调用其构造函数生成新实例（保证类型一致性）
function deepClonePerfect(target,cache=new WeakMap()) {
    // 1，处理基本类型和函数
    if(target === null || typeof target !== "object" || typeof target === "function") {
        return target
    }

    // 2，处理循环引用：若缓存中已有该对象，直接返回缓存的新对象（避免无限递归）
    if (cache.has(target)) {
        return cache.get(target)
    }

    // 3，处理特殊引用类型
    const type = Object.prototype.toString.call(target);
    let newTarget;

    switch(type) {
        // 处理Date
        case "[object Date]":
            newTarget = new Date(target.getTime());
            break;
        // 处理RegExp
        case "[object RegExp]":
            newTarget = new RegExp(target.source, target.flags);
            newTarget.lastIndex = target.lastIndex;
            break;
        // 处理Map
        case "[object Map]":
            newTarget = new Map();
            cache.set(target,newTarget);
            for(const [key, value] of target) {
                newTarget.set(deepClonePerfect(key,cache),deepClonePerfect(value,cache));
            }
            break;
            
        // 处理Set
        case "[object Set]":
            newTarget = new Set();
            cache.set(target,newTarget);
            for(const value of target) {
                newTarget.add(deepClonePerfect(value,cache));
            }
            break;
        // 处理 Array
        case "[object Array]":
            newTarget = [];
            cache.set(target,newTarget);
            for(const item of target) {
                newTarget.push(deepClonePerfect(item,cache));
            }
            break;
        // 处理普通对象[object Object]
        default:
            newTarget = {};
            cache.set(target,newTarget);
            const keys = [...Object.keys(target),...Object.getOwnPropertySymbols(target)];
            for(const key of keys) {
                if(target.hasOwnProperty(key)) {
                    newTarget[key] = deepClonePerfect(target[key],cache);
                }
            }
            break;
    }
    return newTarget;
}

// 测试
const complexObj = {
    a: 1,
    b: new Date(),
    c: Symbol("id"),
    d: new Map([["key",{val: 2}]]),
    e: new Set([3,{f : 4}])
}

// 循环引用
complexObj.self = complexObj;
const copyComplex = deepClonePerfect(complexObj);

// 修改拷贝后的属性，验证独立性
copyComplex.d.set("key1", { val: 5 });
copyComplex.e.add({ f: 6 });
copyComplex.b.setTime(0); // 修改 Date

// 修复访问不存在键的问题
console.log("原Map中key1不存在: ", !complexObj.d.has("key1")); // 验证原Map无影响
console.log("原Set中不包含新添加的对象: ", !complexObj.e.has({ f: 6 })); // 原 Set 无影响
console.log("原Date对象未被修改: ", complexObj.b.getTime() !== 0); // 不是 0（原 Date 无影响）
console.log("循环引用处理正常: ", copyComplex.self === copyComplex); // true（循环引用处理正常，无报错）