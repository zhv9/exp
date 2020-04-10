export interface ILinkedList<T> {
  insertToHead(value: T): void;
  insertToTail(value: T): void;
  insertToIndex(value: T, index: number): void;
  findByIndex(index: number): any;
  findByValue(value: T): any;
  remove(value: T): boolean;
  toString(): string;
}
