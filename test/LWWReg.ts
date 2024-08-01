import { describe, expect, it } from "vitest";
import { LWWReg } from "../src/crdt/LWWReg";

describe("LWWReg", () => {
  it("set first value should work", () => {
    const reg = LWWReg.zero("");
    const text = "first set";
    reg.set(new Date(), text);

    expect(reg.value()).toBe(text);
  });

  it("older set should not update", () => {
    const reg = LWWReg.zero("");
    const text = "first set";
    reg.set(new Date(), text);

    reg.set(new Date(Date.now() - 10000), "second set");
    expect(reg.value()).toBe(text);
  });

  it("new set should update", () => {
    const reg = LWWReg.zero("");
    reg.set(new Date(Date.now() - 10000), "first set");

    const text = "second set";
    reg.set(new Date(), text);
    expect(reg.value()).toBe(text);
  });
});
