export type ReplicaId = string;

class GCounter {
  _value: Map<ReplicaId, bigint>;

  constructor(copy?: GCounter) {
    this._value = new Map(copy?._value);
  }

  static zero(): GCounter {
    return new GCounter();
  }

  static merge(a: GCounter, b: GCounter): GCounter {
    const result: GCounter = new GCounter(a);

    b._value.forEach((v, k) => {
      const val = result._value.get(k) || 0n;
      result._value.set(k, _maxBigInt(val, v));
    });

    return result;
  }

  value(): bigint {
    let acc: bigint = 0n;
    this._value.forEach(v => {
      acc += v;
    });

    return acc;
  }

  inc(id: ReplicaId) {
    const val = this._value.get(id) || 0n;
    this._value.set(id, val + 1n);
  }
}

function _maxBigInt(a: bigint, b: bigint): bigint {
  return a >= b ? a : b;
}

export { GCounter };
