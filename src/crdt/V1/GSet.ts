export class GSet<T> {
  static zero<T>(): GSet<T> {
    return new GSet(new Set());
  }

  static merge<T>(aSet: GSet<T>, bSet: GSet<T>): GSet<T> {
    const newSet = new Set([...aSet.value(), ...bSet.value()]);
    return new GSet(newSet);
  }

  private elements: Set<T>;

  constructor(elements: Set<T>) {
    this.elements = elements;
  }

  value() {
    return this.elements;
  }

  add(value: T) {
    this.elements.add(value);
  }
}
