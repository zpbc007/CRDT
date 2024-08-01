import { describe, expect, it } from "vitest";
import { PNCounter } from "../src/crdt/PNCounter";
import { ReplicaId } from "../src/crdt/GCounter";

describe("PNCounter", () => {
  it("inc should add 1 every time", () => {
    const counter = new PNCounter();
    const replicaId: ReplicaId = "zp-test";

    counter.inc(replicaId);
    expect(counter.value()).toEqual(1n);
    counter.inc(replicaId);
    expect(counter.value()).toEqual(2n);
    counter.inc(replicaId);
    expect(counter.value()).toEqual(3n);
  });

  it("dec should dec 1 every time", () => {
    const counter = new PNCounter();
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
});
