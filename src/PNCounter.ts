import { GCounter, ReplicaId } from "./GCounter";

class PNCounter {
  incGCounter: GCounter;
  decGCounter: GCounter;

  constructor(inc: GCounter, dec: GCounter) {
    this.incGCounter = inc;
    this.decGCounter = dec;
  }

  inc(replicaId: ReplicaId) {
    this.incGCounter.inc(replicaId);
  }

  dec(replicaId: ReplicaId) {
    this.decGCounter.inc(replicaId);
  }

  value(): bigint {
    return this.incGCounter.value() - this.decGCounter.value();
  }

  static merge(a: PNCounter, b: PNCounter): PNCounter {
    return new PNCounter(
      GCounter.merge(a.incGCounter, b.incGCounter),
      GCounter.merge(a.decGCounter, b.decGCounter)
    );
  }
}

export { PNCounter };
