import {right, left, fold, Either} from "fp-ts/lib/Either"
import * as E from "fp-ts/lib/Either";
import {pipe} from "fp-ts/function";

export class ABC {
    private readonly _spellResult: boolean;
    private readonly _blocks: Blocks;

    constructor(spellResult: boolean, blocks: Blocks) {
        this._spellResult = spellResult;
        this._blocks = blocks;
    }

    canMakeWord(word: string) {
        let result = this._blocks.removeBlockMakeUpLetter(word);
        return pipe(result,
            E.fold(
                (error) => false,
                (blocks) => true)
        );
    }

    spellResult() {
        return this._spellResult;
    }

    containsBlock(letter: string) {
        return true;
    }
}

class Block {
    private readonly _letter: string;

    constructor(letter: string) {
        this._letter = letter;
    }

    isEqual(block: Block) {
        return this._letter.toLowerCase() === block._letter.toLowerCase();
    }

    canMakeLetter(singleLetter: string) {
        return this._letter.toLowerCase().indexOf(singleLetter.toLowerCase()) >= 0;
    }
}

class Blocks {
    private readonly _blocks: Block[];

    constructor(blocks: Block[]) {
        this._blocks = blocks;
    }

    containsBlock(letters: string) {
        return this._blocks.findIndex(element => element.isEqual(new Block(letters))) >= 0;
    }

    removeBlockMakeUpLetter(singleLetter: string) {
        let foundIndex = this._blocks.findIndex(element => element.canMakeLetter(singleLetter));
        return foundIndex >= 0 ?
            right(this.removeBlockAt(foundIndex)) :
            left(new Error("There's no match block"));
    }

    private removeBlockAt(foundIndex) {
        let remainingBlocks = this.cloneOriginalBlocks();
        this.removeBlockAtIndex(remainingBlocks, foundIndex);
        return new Blocks(remainingBlocks);
    }

    private removeBlockAtIndex(remainingBlocks: Block[], foundIndex) {
        remainingBlocks.splice(foundIndex, 1);
    }

    private cloneOriginalBlocks() {
        return this._blocks.slice();
    }
}

export class ABCFactory {
    static createDefaultABC = () => new ABC(true, new Blocks([]));

    static createABCFromBlocks(letters: string[]): ABC {
        let blocksObj = this.createBlocksFrom(letters);
        return new ABC(true, blocksObj);
    }

    static createBlocksFrom(letters: string[]) {
        let blocks = letters.map(letter => new Block(letter));
        return new Blocks(blocks);
    }
}

