import { GCounter, ReplicaId } from "./GCounter";

export enum Order {
  lt = -1,
  eq = 0,
  gt = 1,
  cc = 2,
}

export class VClock {
  static zero(): VClock {
    return new VClock();
  }

  static merge(a: VClock, b: VClock): VClock {
    return new VClock(GCounter.merge(a.counter, b.counter));
  }

  static compare(a: VClock, b: VClock): Order {
    const valOrDefault = (k: ReplicaId, clock: VClock): bigint => {
      return clock.counter._value.get(k) || 0n;
    };

    const keys = new Set([
      ...a.counter._value.keys(),
      ...b.counter._value.keys(),
    ]);

    return Array.from(keys).reduce<Order>((prev, k) => {
      const aValue = valOrDefault(k, a);
      const bValue = valOrDefault(k, b);

      if (prev === Order.eq) {
        if (aValue > bValue) return Order.gt;
        if (aValue < bValue) return Order.lt;
      } else if (
        (prev === Order.lt && aValue >= bValue) ||
        (prev === Order.gt && aValue <= bValue)
      ) {
        return Order.cc; // 与之前状态不匹配，出现并发状态
      }

      return prev;
    }, Order.eq);
  }

  counter: GCounter;
  constructor(copy?: GCounter) {
    this.counter = new GCounter(copy);
  }

  inc(replicaId: ReplicaId) {
    this.counter.inc(replicaId);
  }
}
