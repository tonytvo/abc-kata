import { describe, test, expect } from "@jest/globals";
import { ABC } from "../src/ABC";


describe("ABC rules", () => {
  test("can make word for letter A", () => {
    expect(ABCFactory.createDefaultABC().canMakeWord("A").spellResult()).toEqual(true);
  });
});

class ABCFactory {
  static createDefaultABC = () => new ABC(true);
}
