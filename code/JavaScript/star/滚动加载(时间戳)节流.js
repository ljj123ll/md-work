/**
 * 节流函数（时间戳版）
 * @param {Function} func - 需要节流的目标函数（如加载更多数据）
 * @param {Number} interval - 固定间隔时间（毫秒）
 * @returns {Function} 节流后的函数
 */
// 节流函数：是一种用于控制函数执行频率的优化技术，其核心思想是在连续触发的事件中，确保函数在固定的时间间隔内最多执行一次
// 以固定的频率定期执行
function throttle(func, interval) {
  // 1. 用闭包保存「上次执行时间」（初始为 0，确保第一次触发能执行）
  let lastTime = 0;

  return function (...args) {
    const _this = this;
    // 2. 获取当前时间戳（毫秒）
    const nowTime = Date.now();

    // 对于第一次触发的时候，nowtime通常是一个很大的值，减去0一定是大于interval，所以第一次触发的时候一定会执行
    // 3. 关键：若当前时间 - 上次执行时间 >= 间隔，执行函数
    if (nowTime - lastTime >= interval) {
      func.apply(_this, args);
      lastTime = nowTime; // 4. 更新上次执行时间，锁定后续触发
    }
  };
}

// 作用：优化性能防止过渡执行，快速滚动页面的时候会导致滚动事件频繁触发（每秒可能触发10次甚至上百次）
// 保证定期响应，提升用户的体验。减少网络请求，节约资源
// 立即执行，首次触发立即执行，最后一次触发可能不会执行（如果不满足时间差），滚动加载，需要立即响应的操作