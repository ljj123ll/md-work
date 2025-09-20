// 防抖函数：非立即执行版
// {Function} func 要防抖的函数
// {Number} delay 防抖延迟时间（毫秒）
// return {Function} 防抖后的函数

function debounce(func, delay) {
    // 1,使用闭包保存定时变量（多次触发共享同一个timer）
    let timer = null;
    // 2,返回防抖后的函数（接收目标函数的参数，如搜索关键词）
    return function(...args) {
        // 保存this指向（避免func执行时this丢失）
        const _this = this;
        // 3,若再次触发，先清除之前的定时器（重置延迟时间）
        if(timer) clearTimeout(timer);
        // 4,重新设置定时器，延迟delay后执行func
        timer = setTimeout(() => {
            // 绑定this和参数
            func.apply(_this, args);
            // 执行后清空定时器，避免内存泄漏
            timer = null;
        }, delay);
    };
}

// - 闭包的作用：`timer` 变量不会在函数执行后销毁，确保多次触发时能「清除上一次的定时器」；
// - 重置逻辑：每次触发防抖函数时，先清掉之前的 `timer`，再开新定时器 —— 这是「防抖」的核心；
// - `this` 绑定：用 `_this` 保存外层函数的 `this`（如绑定到输入框 DOM 元素），避免 `func` 执行时 `this` 指向全局（浏览器中为 `window`）。