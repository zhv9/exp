import { ILinkedList } from "./ILinkedList";

class SingleNode<T> {
  public value: T;
  public next: SingleNode<T> | null;
  constructor(value: T, next: SingleNode<T> | null = null) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList<T> implements ILinkedList<T> {
  private readonly head: SingleNode<T>;
  constructor() {
    this.head = new SingleNode(null);
  }

  insertToHead(value: T) {
    this.head.next = new SingleNode(value, this.head.next);
  }

  insertToTail(value: T) {
    let p = this.head;
    while (p.next !== null) {
      p = p.next;
    }
    p.next = new SingleNode(value);
  }

  insertToIndex(value: T, index: number): boolean {
    let p = this.head;
    let pos = 0;
    // 如果把下面的 p.next 改成 p，那如果 index 大于链表总长度就不能插入链表了
    while (p.next !== null && pos < index) {
      p = p.next;
      pos++;
    }
    // 在上面将  p.next 改成 p 后，这一句才有作用，是在找到最后一个都没有到 index 的时候返回 false
    if (p === null) return false;
    p.next = new SingleNode(value, p.next);
    return true;
  }

  insertToIndex2(value: T, index: number): boolean {
    if (index === 0) {
      this.insertToHead(value);
      return true;
    }
    const p = this.findByIndex(index - 1);
    if (p === null) return false;
    p.next = new SingleNode(value, p.next);
    return true;
  }

  findByIndex(index: number): SingleNode<T> | null {
    let p = this.head;
    let pos = 0;
    while (p.next !== null && pos < index) {
      p = p.next;
      pos++;
    }
    return p.next;
  }

  findByValue(value: T): SingleNode<T> | null {
    let p = this.head;
    while (p.value !== value && p.next !== null) {
      p = p.next;
    }
    if (p.value !== value) return null;
    return p;
  }

  remove(value: T): boolean {
    let p = this.head;
    // p 是要找 value 前的一个数据，如果这个数据的 next.next 是 null 的话，说明没有找到这个数据
    while (p.next.value !== value && p.next.next !== null) {
      p = p.next;
    }
    if (p.next.value !== value) return false;

    // 第二种方案
    // while (p.next.value !== value && p.next !== null) {
    //   p = p.next;
    // }
    // if (p.next !== null) return false;

    p.next = p.next.next;
    return true;
  }

  toString(): string {
    let data: string = "";
    let p = this.head;
    while (p.next !== null) {
      data += p.next.value.toString();
      p = p.next;
    }
    return data;
  }
}

function checkResult(functionName: string, expected: string, result: string) {
  console.log(
    `${functionName}: expected: ${expected}, result: ${result} | (${expected ===
      result})`
  );
}

function insertToTailTest() {
  const linkedList = new LinkedList<string>();
  const expected = "hello world ";
  linkedList.insertToTail("hello ");
  linkedList.insertToTail("world ");
  const result = linkedList.toString();

  checkResult("insertToTailTest", expected, result);
}

function testNoDataToString() {
  const linkedList = new LinkedList<string>();
  const expected = "";
  const result = linkedList.toString();
  checkResult("testNoDataToString", expected, result);
}

function insertToIndexTest() {
  const linkedList1 = new LinkedList<string>();
  linkedList1.insertToTail("hello ");
  linkedList1.insertToTail("world ");
  linkedList1.insertToIndex("my ", 0);
  const expected1 = "my hello world ";
  checkResult("insertToIndexTest1", expected1, linkedList1.toString());

  const linkedList2 = new LinkedList<string>();
  linkedList2.insertToTail("hello ");
  linkedList2.insertToTail("world ");
  linkedList2.insertToIndex("my ", 1);
  const expected2 = "hello my world ";
  checkResult("insertToIndexTest2", expected2, linkedList2.toString());

  const linkedList3 = new LinkedList<string>();
  linkedList3.insertToTail("hello ");
  linkedList3.insertToTail("world ");
  linkedList3.insertToIndex("my ", 2);
  const expected3 = "hello world my ";
  checkResult("insertToIndexTest3", expected3, linkedList3.toString());
}

function insertToInvalidIndexTest() {
  const linkedList4 = new LinkedList<string>();
  linkedList4.insertToTail("hello ");
  linkedList4.insertToTail("world ");
  linkedList4.insertToIndex("my ", 3);
  const expected4 = "hello world my ";
  checkResult("insertToInvalidIndexTest4", expected4, linkedList4.toString());

  const linkedList5 = new LinkedList<string>();
  linkedList5.insertToIndex("hello ", 0);
  const expected5 = "hello ";
  checkResult("insertToInvalidIndexTest5", expected5, linkedList5.toString());

  const linkedList6 = new LinkedList<string>();
  linkedList6.insertToIndex("hello ", 1);
  const expected6 = "hello ";
  checkResult("insertToInvalidIndexTest6", expected6, linkedList6.toString());
}

function removeTest() {
  const linkedList1 = new LinkedList<string>();
  linkedList1.insertToTail("hello ");
  linkedList1.insertToTail("world ");

  const result1 = linkedList1.remove("hello ");
  const resultData1 = linkedList1.toString();

  checkResult("removeTest1", "true", `${result1}`);
  checkResult("removeTest1", "world ", resultData1);

  const linkedList2 = new LinkedList<string>();
  linkedList2.insertToTail("hello ");
  linkedList2.insertToTail("world ");
  const result2 = linkedList2.remove("world ");
  const resultData2 = linkedList2.toString();
  checkResult("removeTest2", "true", `${result2}`);
  checkResult("removeTest2", "hello ", resultData2);

  const linkedList3 = new LinkedList<string>();
  linkedList3.insertToTail("hello ");
  const result3 = linkedList3.remove("hello ");
  const resultData3 = linkedList3.toString();
  checkResult("removeTest3", "true", `${result3}`);
  checkResult("removeTest3", "", resultData3);
}

function removeInvalidValueTest() {
  const linkedList1 = new LinkedList<string>();
  linkedList1.insertToTail("hello ");
  linkedList1.insertToTail("world ");

  const result1 = linkedList1.remove("my ");
  const resultData1 = linkedList1.toString();

  checkResult("removeInvalidValueTest", "false", `${result1}`);
  checkResult("removeInvalidValueTest", "hello world ", resultData1);
}

function findByValueTest() {
  const linkedList1 = new LinkedList<string>();
  linkedList1.insertToTail("hello ");
  linkedList1.insertToTail("my ");
  linkedList1.insertToTail("world ");

  const result1 = linkedList1.findByValue("hello ");
  checkResult("findByValueTest", "hello ", result1.value);

  const result2 = linkedList1.findByValue("world ");
  checkResult("findByValueTest", "world ", result2.value);

  const result3 = linkedList1.findByValue("hello ");
  checkResult("findByValueTest", "hello ", result3.value);
}

function findByInvalidValueTest() {
  const linkedList1 = new LinkedList<string>();
  linkedList1.insertToTail("hello ");
  linkedList1.insertToTail("world ");

  const node = linkedList1.findByValue("hello");
  const result = node === null ? null : node.value;
  checkResult("findByInvalidValueTest", null, result);
}

function findByIndexTest() {
  const linkedList1 = new LinkedList<string>();
  linkedList1.insertToTail("hello ");
  linkedList1.insertToTail("my ");
  linkedList1.insertToTail("world ");
  const expected0 = "hello ";
  const expected1 = "my ";
  const expected2 = "world ";
  const result1 = linkedList1.findByValue("hello ");
  checkResult("findByIndexTest", expected0, linkedList1.findByIndex(0).value);
  checkResult("findByIndexTest", expected1, linkedList1.findByIndex(1).value);
  checkResult("findByIndexTest", expected2, linkedList1.findByIndex(2).value);
}

function findByInvalidIndexTest() {
  const linkedList1 = new LinkedList<string>();
  linkedList1.insertToTail("hello ");
  linkedList1.insertToTail("my ");
  linkedList1.insertToTail("world ");
  const node1 = linkedList1.findByIndex(3);
  const result1 = node1 === null ? null : node1.value;
  checkResult("findByInvalidIndexTest", null, result1);

  const linkedList2 = new LinkedList<string>();
  const node2 = linkedList2.findByIndex(0);
  const node3 = linkedList2.findByIndex(1);
  const result2 = node2 === null ? null : node2.value;
  const result3 = node3 === null ? null : node3.value;
  checkResult("findByInvalidIndexTest", null, result2);
  checkResult("findByInvalidIndexTest", null, result3);
}

insertToTailTest();
testNoDataToString();
insertToIndexTest();
insertToInvalidIndexTest();
removeTest();
removeInvalidValueTest();
findByValueTest();
findByInvalidValueTest();
findByIndexTest();
findByInvalidIndexTest();
