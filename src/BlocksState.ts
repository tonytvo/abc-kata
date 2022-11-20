import * as E from "fp-ts/Either";
import {pipe} from "fp-ts/function";
import {Blocks} from "./ABC";

export interface BlocksState {
    hasError(): boolean;

    availableBlocks(): Blocks;

    containsBlock(blockLetters: string);

    nextState(remainingBlocks: E.Right<Blocks> | E.Left<Error>): BlocksState;
}

class ErrorState implements BlocksState {
    private readonly _blocks: Blocks;

    private readonly _errors: Error[];

    constructor(blocks: Blocks, errors: Error[]) {
        this._blocks = blocks;
        this._errors = errors;
    }

    nextState(remainingBlocks: E.Right<Blocks> | E.Left<Error>) {
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

export class CurrentBlocksState implements BlocksState {
    private readonly _blocks: Blocks;

    constructor(blocks: Blocks) {
        this._blocks = blocks;
    }

    newErrorState(remainingBlocks: Blocks, error: Error): BlocksState {
        return new ErrorState(remainingBlocks, [error]);
    }

    nextState(remainingBlocks: E.Right<Blocks> | E.Left<Error>) {
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