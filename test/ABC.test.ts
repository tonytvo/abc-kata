import { describe, test, expect } from "@jest/globals";
import {ABCFactory} from "../src/ABC";
import {fail} from "assert";
import * as E from "fp-ts/lib/Either";
import {pipe} from "fp-ts/function";

describe("ABC rules", () => {
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

  test("given single letter, ", () => {
    let abcBlock = ABCFactory.createBlocksFrom(["N A", "B O"]);
    let newBlocks = abcBlock.removeBlockMakeUpLetter("A");
    pipe(
        newBlocks,
        E.fold(
            (error) => fail(error.message),
            (blocks) => {
              expect(blocks.containsBlock("B O")).toEqual(true);
              expect(blocks.containsBlock("N A")).toEqual(false);
            }
        ))
  });

  test("once a letter on a block is used that block cannot be used again", () => {
    let canMakeWord = ABCFactory.createABCFromBlocks(["N A", "B O"]).canMakeWord("A")
    expect(canMakeWord).toEqual(true);
  });

  test("can make word for AB", () => {
    let canMakeWord = ABCFactory.createABCFromBlocks(["N A", "B O"]).canMakeWord("AB")
    expect(canMakeWord).toEqual(true);
  });

  test.skip("can make word for A, BARK, but not BOOK", () => {
    let abc = ABCFactory.createABCFromBlocks(["B O", "X K", "D Q", "C P", "N A", "G T", "R E", "T G", "Q D", "F S", "J W", "H U", "V I", "A N", "O B", "E R", "F S", "L Y", "P C", "Z M"]);

    let canMakeWords = abc.canMakeWords(["A", "BARK", "BOOK"]);

    expect(canMakeWords).toEqual([true, true, false]);
  });

});