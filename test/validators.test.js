import { describe, expect, it } from "vitest";

import { validateAbn, validateAcn } from "../src/validators.js";

describe("validateAbn", () => {
  it("accepts a valid ABN", () => {
    const result = validateAbn("51 824 753 556");

    expect(result.valid).toBe(true);
    expect(result.checksum_valid).toBe(true);
    expect(result.normalized).toBe("51824753556");
    expect(result.formatted).toBe("51 824 753 556");
  });

  it("accepts formatting with hyphens", () => {
    const result = validateAbn("51-824-753-556");

    expect(result.valid).toBe(true);
  });

  it("rejects an invalid ABN checksum", () => {
    const result = validateAbn("51 824 753 557");

    expect(result.valid).toBe(false);
    expect(result.checksum_valid).toBe(false);
  });

  it("rejects an invalid ABN length", () => {
    const result = validateAbn("12345");

    expect(result.valid).toBe(false);
    expect(result.valid_format).toBe(false);
  });
});

describe("validateAcn", () => {
  it("accepts a valid ACN", () => {
    const result = validateAcn("004 085 616");

    expect(result.valid).toBe(true);
    expect(result.checksum_valid).toBe(true);
    expect(result.normalized).toBe("004085616");
    expect(result.formatted).toBe("004 085 616");
  });

  it("accepts formatting with hyphens", () => {
    const result = validateAcn("004-085-616");

    expect(result.valid).toBe(true);
  });

  it("rejects an invalid ACN checksum", () => {
    const result = validateAcn("004 085 617");

    expect(result.valid).toBe(false);
    expect(result.checksum_valid).toBe(false);
  });

  it("rejects an invalid ACN length", () => {
    const result = validateAcn("1234");

    expect(result.valid).toBe(false);
    expect(result.valid_format).toBe(false);
  });
});
