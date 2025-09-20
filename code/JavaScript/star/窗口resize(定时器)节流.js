function throttle(func, interval) {
  // 1. 用闭包保存定时器状态
  let timer = null;

  return function (...args) {
    const _this = this;

    // 2. 关键：若没有定时器，才设置新定时器（确保间隔内只执行一次）
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(_this, args);
        timer = null; // 3. 执行后清空定时器，允许下一次触发
      }, interval);
    }
  };
}

// 优化性能，防止过度执行，窗口调整大小的时候会频繁触发，如果每次触发都执行func函数，会导致性能问题
// 所以需要节流，确保在固定的时间间隔内最多执行一次func函数

// 区别：延迟执行（等待interval后），首次触发不执行，最后一次触发的时候延迟interval后执行
// 适用场景：窗口resize，元素拖拽，结束后需要的操作）