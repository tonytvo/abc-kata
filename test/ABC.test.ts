import { describe, test, expect } from "@jest/globals";
import { ABC } from "../src/ABC";
import {fail} from "assert";


describe("ABC rules", () => {
  test("can make word for letter A", () => {
    expect(ABCFactory.createDefaultABC().canMakeWord("A").spellResult()).toEqual(true);
  });

  test.skip("once a litter on a block isused that block cannot be used again", () => {
    //let abc = ABCFactory.createABCFromBlocks("N A", "B O").canMakeWord("A")
    //expect(abc.containsBlock("N A")).toEqual(false);
    fail();
  });

});

class ABCFactory {
  static createDefaultABC = () => new ABC(true);
}
