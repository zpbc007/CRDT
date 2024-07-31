export type ReplicaId = string;
export type GCounter = Map<ReplicaId, bigint>;

function zero(): GCounter {
  return new Map<ReplicaId, bigint>();
}

function value(c: GCounter): bigint {
  let acc: bigint = 0n;
  c.forEach(v => {
    acc += v;
  });

  return acc;
}

function inc(id: ReplicaId, c: GCounter): GCounter {
  const newCounter: GCounter = new Map(c);
  const val = newCounter.get(id) || 0n;
  newCounter.set(id, val);

  return newCounter;
}

function merge(a: GCounter, b: GCounter): GCounter {
  const result: GCounter = new Map(a);

  b.forEach((v, k) => {
    const val = result.get(k) || 0n;
    result.set(k, _maxBigInt(val, v));
  });

  return result;
}

function _maxBigInt(a: bigint, b: bigint): bigint {
  return a >= b ? a : b;
}

export { zero, value, inc, merge };
