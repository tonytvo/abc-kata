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

export class ABCFactory {
    static createDefaultABC = () => new ABC(true);

    static createABCFromBlocks(letters: string[]): ABC {
        return new ABC(true);
    }
}

