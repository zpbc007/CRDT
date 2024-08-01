// 添加或更新
export function upsert<K, V>(
  k: K,
  initialValue: V,
  valueUpdater: (v: V) => V,
  map: Map<K, V>
) {
  if (map.has(k)) {
    map.set(k, valueUpdater(map.get(k)!));
  } else {
    map.set(k, initialValue);
  }
}

export function mergeOption<V>(
  merge: (a: V, b: V) => V,
  a?: V,
  b?: V
): V | undefined {
  if (a !== undefined && b !== undefined) {
    return merge(a, b);
  }

  return a || b || undefined;
}

export function maxBigInt(a: bigint, b: bigint): bigint {
  return a >= b ? a : b;
}
