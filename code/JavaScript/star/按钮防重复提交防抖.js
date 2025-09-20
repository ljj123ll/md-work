// 通过闭包保存了timer变量的状态，使其在多次函数调用之间能够保持持久性
function debounce(func, delay, immediate = false) {
  let timer = null;

  return function (...args) {
    const _this = this;

    // 每次触发的时候，如果有定时器就清除掉
    if (timer) clearTimeout(timer);

    // 立即执行逻辑：若第一次触发且 timer 为 null，直接执行
    if (immediate && !timer) {
      func.apply(_this, args);
    }
    
    // 延迟重置定时器（即使立即执行了，后续触发仍需延迟）
    timer = setTimeout(() => {
      timer = null; // 延迟后清空定时器，允许下次触发
      // 非立即执行的逻辑（若 immediate 为 false，延迟后执行）如果immediate为true则不执行
      if (!immediate) {
        func.apply(_this, args);
      }
    }, delay);
  };
}