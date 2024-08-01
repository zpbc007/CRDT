import { describe, expect, it } from "vitest";
import { upsert } from "../../src/crdt/V2/helper";

describe("upsert", () => {
  it("upsert new key should work", () => {
    const map = new Map<string, number>();
    const key = "test-key";

    upsert(key, 1, oldValue => oldValue, map);

    expect(map.get(key)).toEqual(1);
  });

  it("upsert old key should work", () => {
    const map = new Map<string, number>();
    const key = "test-key";

    upsert(key, 1, oldValue => oldValue, map);
    upsert(key, 2, oldValue => oldValue + 2, map);

    expect(map.get(key)).toEqual(3);
  });

  it("upsert old key should work", () => {
    const map = new Map<string, number>();
    const key = "test-key";

    upsert(key, 1, oldValue => oldValue, map);
    upsert(key, 2, oldValue => oldValue + 2, map);

    expect(map.get(key)).toEqual(3);
  });
});
