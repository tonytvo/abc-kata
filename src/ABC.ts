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
}
