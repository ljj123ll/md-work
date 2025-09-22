// 链表节点定义
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

// 尾递归反转链表：传递当前节点和前驱节点（中间结果）
function reverseListTail(head, prev = null) {
  // 终止条件：遍历到链表末尾，返回前驱节点（新头）
  if (!head) return prev;
  // 保存下一个节点（避免断链）
  const next = head.next;
  // 反转当前节点的指向（指向前驱）
  head.next = prev;
  // 最后一步调用自身：传递下一个节点和当前节点（新前驱）
  return reverseListTail(next, head);
}

// 测试：创建链表 1→2→3
const head = new ListNode(1, new ListNode(2, new ListNode(3)));
let headlist = head;
while (headlist) {
  console.log(headlist.val); // 3 → 2 → 1
  headlist = headlist.next;
}
const reversedHead = reverseListTail(head);
// 遍历反转后的链表：3→2→1
let curr = reversedHead;
while (curr) {
  console.log(curr.val); // 3 → 2 → 1
  curr = curr.next;
}