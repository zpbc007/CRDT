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
  a: V | null,
  b: V | null
): V | null {
  if (a !== null && b !== null) {
    return merge(a, b);
  }

  return a || b || null;
}
