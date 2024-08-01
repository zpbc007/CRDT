import { describe, expect, it } from "vitest";
import { ORSet } from "../src/crdt/ORSet";
import { ReplicaId } from "../src/crdt/GCounter";

describe("ORSet", () => {
  const replicaId: ReplicaId = "zp-test";

  it("add should work", () => {
    const set: ORSet<number> = ORSet.zero();

    set.add(replicaId, 1);
    expect(new Set(set.value().keys())).toEqual(new Set([1]));
    set.add(replicaId, 2);
    expect(new Set(set.value().keys())).toEqual(new Set([1, 2]));
    set.add(replicaId, 3);
    expect(new Set(set.value().keys())).toEqual(new Set([1, 2, 3]));
  });

  it("remove should work", () => {
    const set: ORSet<number> = ORSet.zero();

    set.add(replicaId, 1);
    set.add(replicaId, 2);
    set.add(replicaId, 3);

    set.remove(replicaId, 1);
    expect(new Set(set.value().keys())).toEqual(new Set([2, 3]));
    set.remove(replicaId, 2);
    expect(new Set(set.value().keys())).toEqual(new Set([3]));
    set.remove(replicaId, 3);
    expect(new Set(set.value().keys())).toEqual(new Set([]));
  });

  it("merge should work", () => {
    const setA: ORSet<number> = ORSet.zero();
    const setB: ORSet<number> = ORSet.zero();

    setA.add(replicaId, 1);
    setA.add(replicaId, 2);
    setA.add(replicaId, 3);

    setA.remove(replicaId, 1);
    setA.remove(replicaId, 2);

    setB.add(replicaId, 4);
    setB.add(replicaId, 5);
    setB.add(replicaId, 6);

    setB.remove(replicaId, 5);
    setB.remove(replicaId, 6);

    expect(new Set(ORSet.merge(setA, setB).value().keys())).toEqual(
      new Set([3, 4])
    );
  });
});
