import { describe, expect, it } from "vitest";
import { GCounter, ReplicaId } from "../../src/crdt/V2/GCounter";

describe("GCounter", () => {
  it("zero should be empty", () => {
    expect(GCounter.zero().value()).toEqual(0n);
  });

  it("inc should increase by 1", () => {
    const counter = GCounter.zero();
    const replicaId: ReplicaId = "zp-test";

    counter.inc(replicaId);
    expect(counter.value()).toEqual(1n);

    counter.inc(replicaId);
    expect(counter.value()).toEqual(2n);
  });

  it("merge should use all the max value", () => {
    const counterA = GCounter.zero();
    const counterB = GCounter.zero();

    const replicaId1: ReplicaId = "zp-test-1";
    const replicaId2: ReplicaId = "zp-test-2";

    counterA.inc(replicaId1);
    counterA.inc(replicaId1);
    counterA.inc(replicaId2);

    counterB.inc(replicaId1);
    counterB.inc(replicaId2);
    counterB.inc(replicaId2);

    const mergedCounter = GCounter.merge(counterA, counterB);
    expect(mergedCounter.value()).toEqual(4n);
  });

  it("merge delta should work", () => {
    const counterA = GCounter.zero();
    const counterB = GCounter.zero();
    const replicaId: ReplicaId = "zp-test-1";

    counterA.inc(replicaId);
    counterA.inc(replicaId);

    counterB.mergeDelta(counterA.split()[1]!);
    expect(counterB.value()).toEqual(2n);
  });
});
