export class ABC {
    private readonly _spellResult: boolean;
    private readonly _blocks: Blocks;

    constructor(spellResult: boolean, blocks: Blocks) {
        this._spellResult = spellResult;
        this._blocks = blocks;
    }

    canMakeWord(word: string): ABC {
        return new ABC(true, new Blocks([]));
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
}

class Blocks {
    private readonly _blocks: Block[];
    constructor(blocks: Block[]) {
        this._blocks = blocks;
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

