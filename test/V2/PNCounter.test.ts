import { describe, expect, it } from "vitest";
import { PNCounter } from "../../src/crdt/V2/PNCounter";
import { ReplicaId } from "../../src/crdt/V2/GCounter";

describe("PNCounter", () => {
  it("inc should add 1 every time", () => {
    const counter = PNCounter.zero();
    const replicaId: ReplicaId = "zp-test";

    counter.inc(replicaId);
    expect(counter.value()).toEqual(1n);
    counter.inc(replicaId);
    expect(counter.value()).toEqual(2n);
    counter.inc(replicaId);
    expect(counter.value()).toEqual(3n);
  });

  it("dec should dec 1 every time", () => {
    const counter = PNCounter.zero();
    const replicaId: ReplicaId = "zp-test";

    counter.inc(replicaId);
    counter.inc(replicaId);
    counter.inc(replicaId);

    counter.dec(replicaId);
    expect(counter.value()).toEqual(2n);

    counter.dec(replicaId);
    expect(counter.value()).toEqual(1n);

    counter.dec(replicaId);
    expect(counter.value()).toEqual(0n);
  });

  it("split and mergeDelta should work", () => {
    const counter1 = PNCounter.zero();
    const counter2 = PNCounter.zero();
    const replicaId: ReplicaId = "zp-test";

    counter1.inc(replicaId);
    counter1.inc(replicaId);
    counter1.inc(replicaId);

    const counter1Delta = counter1.split()[1];

    counter2.inc(replicaId);
    counter2.inc(replicaId);
    counter2.mergeDelta(counter1Delta!);

    expect(counter2.value()).toEqual(3n);
  });
});
