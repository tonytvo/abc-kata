import * as E from "fp-ts/lib/Either";
import {pipe} from "fp-ts/function";
import * as S from "fp-ts/lib/State";
import {map} from 'fp-ts/Array'
import {BlocksState, CurrentBlocksState} from "./BlocksState";

export class ABC {
    private readonly _blocksState: BlocksState;

    constructor(blocksState: BlocksState) {
        this._blocksState = blocksState;
    }

    canMakeWord(word: string) {
        let actions = this.makeSingleLetterFromBlocksAction(word.split(""));

        const [, finalState] = S.sequenceArray(actions)(this._blocksState);

        return !finalState.hasError();
    }

    private makeSingleLetterFromBlocksAction(letters: string[]) {
        function blockStateAction(singleLetter: string): S.State<BlocksState, any> {
            return (state: BlocksState) => {
                let remainingBlocksOrError = state.availableBlocks().removeBlockMakeUpLetter(singleLetter);
                let nextState = state.nextState(remainingBlocksOrError);
                return [[], nextState];
            };
        }

        const letterToStateAction = (letter: string) => blockStateAction(letter);
        return pipe(letters, map(letterToStateAction));
    }

    containsBlock(blockLetters: string) {
        return this._blocksState.containsBlock(blockLetters);
    }

    canMakeWords(words: string[]) {
        return words.map(word => this.canMakeWord(word));
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

export class Blocks {
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
            E.right(this.removeBlockAt(foundIndex)) :
            E.left(new Error("There's no match block"));
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
    static createABCFromBlocks(letters: string[]): ABC {
        return new ABC(new CurrentBlocksState(this.createBlocksFrom(letters)));
    }

    static createBlocksFrom(letters: string[]) {
        let blocks = letters.map(letter => new Block(letter));
        return new Blocks(blocks);
    }
}

