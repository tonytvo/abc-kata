import { describe, test, expect } from "@jest/globals";
import { ABC } from "../src/ABC";


describe("ABC rules", () => {
  test("can make word for letter A", () => {
    expect(ABC.canMakeWord("A")).toEqual(true);
  });
});
