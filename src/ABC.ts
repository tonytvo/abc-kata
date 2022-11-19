export class ABC {
    private readonly _spellResult: boolean;
    constructor(spellResult: boolean) {
        this._spellResult = spellResult;
    }

    canMakeWord(word: string): ABC {
        return new ABC(true);
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

export class ABCFactory {
    static createDefaultABC = () => new ABC(true);

    static createABCFromBlocks(letters: string[]): ABC {
        letters.map(letter => new Block(letter));
        return new ABC(true);
    }
}

