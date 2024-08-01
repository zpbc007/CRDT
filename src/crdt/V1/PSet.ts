import { GSet } from "./GSet";

export class PSet<T> {
  static zero<T>(): PSet<T> {
    return new PSet(GSet.zero(), GSet.zero());
  }

  static merge<T>(aSet: PSet<T>, bSet: PSet<T>): PSet<T> {
    const mergedAdd = GSet.merge(aSet._add, bSet._add);
    const mergedRem = GSet.merge(aSet._rem, bSet._rem);

    return new PSet(mergedAdd, mergedRem);
  }

  _add: GSet<T>;
  _rem: GSet<T>;

  constructor(add: GSet<T>, rem: GSet<T>) {
    this._add = add;
    this._rem = rem;
  }

  value(): Set<T> {
    const result = new Set(this._add.value());
    this._rem.value().forEach(item => result.delete(item));

    return result;
  }

  add(value: T) {
    this._add.add(value);
  }

  rem(value: T) {
    this._rem.add(value);
  }
}
