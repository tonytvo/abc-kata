import { describe, test, expect } from "@jest/globals";
import { ABC } from "../src/ABC";


describe("ABC rules", () => {
  const createDefaultABC = () => new ABC(true);

  test("can make word for letter A", () => {
    expect(createDefaultABC().canMakeWord("A").spellResult()).toEqual(true);
  });
});
