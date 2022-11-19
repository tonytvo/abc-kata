import { describe, test, expect } from "@jest/globals";
import {ABCFactory} from "../src/ABC";
import {fail} from "assert";

describe("ABC rules", () => {
  test("can make word for letter A", () => {
    expect(ABCFactory.createDefaultABC().canMakeWord("A").spellResult()).toEqual(true);
  });

  test("once a litter on a block isused that block cannot be used again", () => {
    let abc = ABCFactory.createABCFromBlocks(["N A", "B O"]);
    expect(abc.containsBlock("N A")).toEqual(true);
  });

  test("once a litter on a block isused that block cannot be used again", () => {
    let abc = ABCFactory.createBlocksFrom(["N A", "B O"]);
    expect(abc.containsBlock("N A")).toEqual(true);
    expect(abc.containsBlock("B O")).toEqual(true);
    expect(abc.containsBlock("N C")).toEqual(false);
  });

  test.skip("once a litter on a block isused that block cannot be used again", () => {
    //let abc = ABCFactory.createABCFromBlocks("N A", "B O").canMakeWord("A")
    //expect(abc.containsBlock("N A")).toEqual(false);
    fail();
  });

});