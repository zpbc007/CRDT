import { GCounter, ReplicaId } from "./GCounter";

export class PNCounter {
  static zero(): PNCounter {
    return new PNCounter(GCounter.zero(), GCounter.zero());
  }

  static merge(a: PNCounter, b: PNCounter): PNCounter {
    return new PNCounter(
      GCounter.merge(a._inc, b._inc),
      GCounter.merge(a._dec, b._dec)
    );
  }

  _inc: GCounter;
  _dec: GCounter;

  constructor(inc: GCounter, dec: GCounter) {
    this._inc = inc;
    this._dec = dec;
  }

  value(): bigint {
    return this._inc.value() - this._dec.value();
  }

  inc(replicaId: ReplicaId) {
    this._inc.inc(replicaId);
  }

  dec(replicaId: ReplicaId) {
    this._dec.inc(replicaId);
  }

  mergeDelta(delta: PNCounter) {
    const newCounter = PNCounter.merge(delta, this);
    this._inc = newCounter._inc;
    this._dec = newCounter._dec;
  }

  split(): [PNCounter, PNCounter?] {
    const deltaInc = this._inc.delta || GCounter.zero();
    const deltaDec = this._dec.delta || GCounter.zero();
    const delta = new PNCounter(deltaInc, deltaDec);

    const newInc = this._inc.copy();
    const newDec = this._dec.copy();
    newInc.delta = undefined;
    newDec.delta = undefined;

    return [new PNCounter(newInc, newDec), delta];
  }
}
