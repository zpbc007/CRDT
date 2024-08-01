import { describe, expect, it } from "vitest";
import { PSet } from "../src/crdt/PSet";

describe("PSet", () => {
  it("add, remove should work", () => {
    const set: PSet<number> = PSet.zero();

    set.add(1);
    set.add(2);
    set.rem(1);

    expect(set.value()).toEqual(new Set([2]));
  });

  it("merge should merge add & rem", () => {
    const setA: PSet<number> = PSet.zero();
    const setB: PSet<number> = PSet.zero();

    setA.add(1);
    setA.add(2);
    setA.rem(1);

    setB.add(3);
    setB.add(4);
    setB.rem(4);

    expect(PSet.merge(setA, setB).value()).toEqual(new Set([2, 3]));
  });
});
