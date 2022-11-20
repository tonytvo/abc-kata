import {right, left} from "fp-ts/lib/Either"
import * as E from "fp-ts/lib/Either";
import {pipe} from "fp-ts/function";
import * as S from "fp-ts/lib/State";
import { map } from 'fp-ts/Array'
import {Left, Right} from "fp-ts/es6/Either";

export class ABC {
    private readonly _blocksState: BlocksState;

    constructor(spellResult: boolean, blocks: Blocks, blocksState: BlocksState) {
        this._blocksState = blocksState;
    }

    canMakeWord(word: string) {
        const blockStateAction = (singleLetter: string): S.State<BlocksState, BlocksState> => {
            return (state: BlocksState) => {
                let remainingBlocks = state.availableBlocks().removeBlockMakeUpLetter(singleLetter);
                let nextState = state.nextState(remainingBlocks);
                return [nextState, nextState];
            };
        };

        const letterToStateAction = (letter: string) =>  blockStateAction(letter);
        let actions = pipe(word.split(""), map(letterToStateAction))

        const [, finalState] = S.sequenceArray(actions)(this._blocksState);

        return !finalState.hasError();
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

interface BlocksState {
    hasError(): boolean;
    availableBlocks(): Blocks;
    containsBlock(blockLetters: string);
    nextState(remainingBlocks: Right<Blocks> | Left<Error>): BlocksState;
}

class ErrorState implements BlocksState {
    private readonly _blocks: Blocks;

    private readonly _errors: Error[];
    constructor(blocks: Blocks, errors: Error[]) {
        this._blocks = blocks;
        this._errors = errors;
    }
    nextState(remainingBlocks: Right<Blocks> | Left<Error>) {
        return pipe(remainingBlocks,
            E.fold(
                (error) => new ErrorState(this._blocks, this._errors.concat([error])),
                (blocks) => new ErrorState(blocks, this._errors))
        )
    }

    containsBlock(blockLetters: string) {
        return this._blocks.containsBlock(blockLetters);
    }

    availableBlocks(): Blocks {
        return this._blocks;
    }

    hasError(): boolean {
        return true;
    }

}

class CurrentBlocksState implements BlocksState {
    private readonly _blocks: Blocks;

    constructor(blocks: Blocks) {
        this._blocks = blocks;
    }

    newErrorState(remainingBlocks: Blocks, error: Error): BlocksState {
        return new ErrorState(remainingBlocks, [error]);
    }

    nextState(remainingBlocks: Right<Blocks> | Left<Error>) {
        return pipe(remainingBlocks,
            E.fold(
                (error) => this.newErrorState(this._blocks, error),
                (blocks) => new CurrentBlocksState(blocks))
        )
    }

    containsBlock(blockLetters: string) {
        return this._blocks.containsBlock(blockLetters);
    }

    availableBlocks(): Blocks {
        return this._blocks;
    }

    hasError(): boolean {
        return false;
    }
}


export class ABCFactory {
    static createABCFromBlocks(letters: string[]): ABC {
        let blocksObj = this.createBlocksFrom(letters);
        return new ABC(true, blocksObj, new CurrentBlocksState(this.createBlocksFrom(letters)));
    }

    static createBlocksFrom(letters: string[]) {
        let blocks = letters.map(letter => new Block(letter));
        return new Blocks(blocks);
    }
}

