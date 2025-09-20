let obj = {
    name: 'jack',
    age: 18,
    hobby: ['coding', 'game'],
    info: {
        height: 1.88,
        weight: 80
    },
    fn() {
        console.log('this.name')

    }
};
console.log("打印原始数据")
console.log(obj)
// 序列化和反序列化实现深拷贝（无法拷贝函数）
let obj2 = JSON.parse(JSON.stringify(obj))
console.log("打印序列化深拷贝的obj2")
console.log(obj2)

// 定义深拷贝函数deepClone
function deepClone(oldData) {
    if (typeof oldData === 'object' && oldData !== null) {
        // 判断是数组还是对象，数组则新建一个空数组，对象则新建一个空对象
        let res = Array.isArray(oldData) ? [] : {};
        for (let k in oldData) {
            if (oldData.hasOwnProperty(k)) {
                res[k] = deepClone(oldData[k]);
            }
        }
        return res;
    }else {
        return oldData;
    }
}

let obj3 = deepClone(obj);
console.log("打印递归实现的深拷贝obj3")
console.log(obj3)

obj.hobby.push('dance')
obj.fn = function() {
    console.log(this.age)
}

console.log("打印修改后的obj123")
console.log(obj)
console.log(obj2)
console.log(obj3)



// 这段代码展示了 JavaScript 中两种常见的深拷贝实现方式（JSON 序列化反序列化、递归克隆），并通过修改原对象后的对比，直观体现了深拷贝的特性。我们可以从「深拷贝的本质」「两种实现的差异」「代码运行结果分析」三个维度来理解：
// 一、深拷贝的本质
// 深拷贝的核心是创建一个与原对象完全独立的新对象，具体表现为：

// 对于基本类型（如 name: 'jack'、age: 18）：拷贝其值，原对象和拷贝对象的基本类型属性互不影响。
// 对于引用类型（如 hobby 数组、info 对象、fn 函数）：会创建新的内存空间存储引用类型的值，原对象和拷贝对象的引用类型属性指向不同的内存地址，修改其中一个不会影响另一个。

// 这与浅拷贝（只复制引用类型的地址，原对象和拷贝对象共享同一块内存）形成鲜明对比。
// 二、两种深拷贝实现的原理与局限
// 1. JSON 序列化反序列化（JSON.parse(JSON.stringify(obj))）
// 原理：

// 第一步：JSON.stringify(obj) 将对象转为 JSON 字符串（仅保留可被 JSON 规范支持的数据）。
// 第二步：JSON.parse(...) 将 JSON 字符串转回新对象，从而实现拷贝。

// 代码中表现：

// obj2 是通过这种方式创建的拷贝对象。
// 原对象 obj 中的 fn 函数在 obj2 中消失了（原因见局限性）。

// 局限性（导致 obj2 与原对象不一致的关键）：

// 无法拷贝函数：JSON 规范不支持函数类型，JSON.stringify 会自动忽略对象中的函数属性（如 fn）。
// 无法处理循环引用：如果对象存在循环引用（如 obj.self = obj），会直接报错。
// 特殊类型处理异常：对 Date（转为字符串后再解析会变成字符串，而非 Date 对象）、RegExp（会丢失正则属性）、Symbol（会被忽略）等类型处理不符合预期。
// 2. 递归实现的 deepClone 函数
// 原理：
// 通过递归遍历对象的每一层属性，对不同类型的数据做针对性处理：

// 若为基本类型（非对象或为 null）：直接返回其值（值拷贝）。
// 若为引用类型：
// 数组：创建新数组，递归拷贝每个元素。
// 对象：创建新对象，递归拷贝每个自有属性（通过 hasOwnProperty 过滤原型链属性）。

// 代码中实现细节：

// js
// function deepClone(oldData) {
//   // 非对象类型（基本类型或 null）直接返回
//   if (typeof oldData === 'object' && oldData !== null) {
//     // 区分数组和对象，初始化新的容器
//     let res = Array.isArray(oldData) ? [] : {};
//     // 遍历原对象的自有属性（避免拷贝原型链属性）
//     for (let k in oldData) {
//       if (oldData.hasOwnProperty(k)) {
//         // 递归拷贝属性值（处理嵌套结构）
//         res[k] = deepClone(oldData[k]);
//       }
//     }
//     return res;
//   } else {
//     return oldData;
//   }
// }

// 代码中表现：

// obj3 是通过这种方式创建的拷贝对象。
// 原对象 obj 中的 fn 函数被成功拷贝到 obj3 中（因为函数是引用类型，递归时会复制其引用，新对象和原对象的 fn 指向不同的函数内存地址吗？不，这里需要注意：函数本身是引用类型，deepClone 对函数的处理是 “复制引用”——obj3.fn 与 obj.fn 最初指向同一个函数，但当原对象的 fn 被重新赋值后，obj3.fn 不受影响，因为它们是两个独立的引用）。

// 局限性：

// 未处理 Map、Set 等特殊引用类型：当前实现只支持普通对象和数组，对 Map、Set 会被当作普通对象处理（丢失其特性）。
// 未处理循环引用：若原对象存在循环引用（如 obj.a = obj），递归会陷入死循环导致栈溢出。
// 函数拷贝是 “引用复制”：虽然函数被拷贝到新对象中，但本质是复制了函数的引用（不过这通常符合预期，因为函数本身是不可变的，重新赋值才会改变引用）。
// 三、代码运行结果分析（修改原对象后的对比）
// 修改操作：

// js
// // 给原对象的 hobby 数组添加元素
// obj.hobby.push('dance');
// // 重写原对象的 fn 函数
// obj.fn = function() {
//   console.log(this.age)
// };
// 1. 原对象 obj 的变化：
// hobby 变为 ['coding', 'game', 'dance']（数组被修改）。
// fn 指向新函数（打印 this.age）。
// 2. obj2（JSON 序列化拷贝）的结果：
// hobby 仍为 ['coding', 'game']：因为 obj2.hobby 是原数组的深拷贝，与 obj.hobby 指向不同内存，原数组修改不影响它。
// 无 fn 属性：因为 JSON.stringify 忽略了函数，obj2 从创建时就没有 fn。
// 3. obj3（递归拷贝）的结果：
// hobby 仍为 ['coding', 'game']：obj3.hobby 是深拷贝的新数组，与原数组独立，不受原对象修改影响。
// fn 仍为原来的函数（打印 'this.name'）：因为 obj3.fn 拷贝的是原对象最初的 fn 引用，原对象后续重写 fn 时，只是改变了 obj 中 fn 的指向，不影响 obj3.fn 的指向。
// 总结
// 两种深拷贝方式的核心差异在于对「特殊类型的处理能力」：

// JSON 序列化反序列化：实现简单，但不支持函数、循环引用等，适合纯 JSON 数据（无复杂类型）的拷贝。
// 递归 deepClone：支持函数、嵌套对象 / 数组，但需手动扩展以支持 Map、Set 等特殊类型，且需处理循环引用问题。

// 深拷贝的核心价值是隔离原对象和拷贝对象的引用类型修改，这在需要独立操作数据副本的场景（如状态管理、数据缓存）中至关重要。