import { describe, expect, it } from "vitest";
import { Order, VTime } from "../src/crdt/VClock";
import { ReplicaId } from "../src/crdt/GCounter";

describe("VClock", () => {
  it("compare should be eq", () => {
    const clock1 = VTime.zero();
    const clock2 = VTime.zero();
    const replicaId: ReplicaId = "zp-test";

    clock1.inc(replicaId);
    clock1.inc(replicaId);

    clock2.inc(replicaId);
    clock2.inc(replicaId);

    expect(VTime.compare(clock1, clock2)).toEqual(Order.eq);
  });

  it("compare should be lt", () => {
    const clock1 = VTime.zero();
    const clock2 = VTime.zero();
    const replicaId: ReplicaId = "zp-test";

    clock1.inc(replicaId);
    expect(clock1.counter.value()).toEqual(1n);

    clock2.inc(replicaId);
    clock2.inc(replicaId);
    expect(clock2.counter.value()).toEqual(2n);

    expect(VTime.compare(clock1, clock2)).toEqual(Order.lt);
  });
});
