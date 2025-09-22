// 尾递归实现斐波那契：传递前两个值作为中间结果
function fibTail(n, a = 0, b = 1) {
  if (n === 0) return a; // F(0)=0
  if (n === 1) return b; // F(1)=1
  // 最后一步调用自身：传递b（F(n-1)）和a+b（F(n)）
  //b 的值返回当作 a，a+b 的值返回当作 b
  return fibTail(n - 1, b, a + b);
}

console.log(fibTail(5)); // 5
console.log(fibTail(1000)); // 若引擎支持，可快速返回结果（普通递归会直接溢出）