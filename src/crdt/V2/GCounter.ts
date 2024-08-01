import { maxBigInt, mergeOption, upsert } from "./helper";

export type ReplicaId = string;

export class GCounter {
  static zero(): GCounter {
    return new GCounter(new Map());
  }

  static merge(a: GCounter, b: GCounter): GCounter {
    const values = new Map(a.values);
    for (const [key, value] of b.values) {
      upsert(key, value, v => maxBigInt(v, value), values);
    }
    const delta = mergeOption(GCounter.merge, a.delta, b.delta);

    return new GCounter(values, delta);
  }

  values: Map<ReplicaId, bigint>;
  delta?: GCounter;

  constructor(values: Map<ReplicaId, bigint>, delta?: GCounter) {
    this.values = values;
    this.delta = delta;
  }

  value(): bigint {
    let sum = 0n;
    for (const value of this.values.values()) {
      sum += value;
    }

    return sum;
  }

  inc(replicaId: ReplicaId) {
    const addOne = (map: Map<ReplicaId, bigint>) =>
      upsert(replicaId, 1n, v => v + 1n, map);
    const delta = this.delta || GCounter.zero();

    addOne(this.values);
    addOne(delta.values);
    this.delta = delta;
  }

  mergeDelta(delta: GCounter) {
    const newCounter = GCounter.merge(delta, this);
    this.values = newCounter.values;
    this.delta = newCounter.delta;
  }

  split(): [GCounter, GCounter?] {
    return [GCounter.zero(), this.delta];
  }
}
