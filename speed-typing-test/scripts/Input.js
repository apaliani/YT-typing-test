import {
    textAreaInput,
    textAreaText,
    getRandomParagraph,
    keys,
    ignoredKeys,
    punctuationOrSpace,
  } from "./constants.js";
  import Word from "./Word.js";
  import Letter from "./Letter.js";

export default class Input {
    constructor(keyboardObject, wpmTileObject, accuracyTileObject, timeTileObject) {
        this.textAreaInput = textAreaInput;
        this.textAreaText = textAreaText;

        this.wordObjects = [];
        this.letterObjects = [];

        this.isRunning = false;
        this.isReset = false;
        this.time = 0;

        this.currentLetterIndex = 0;

        this.correctKeysTyped = 0;
        this.keysTyped = 0;

        this.Keyboard = keyboardObject;

        this.Accuracy = accuracyTileObject;
        this.WPM = wpmTileObject;
        this.Time = timeTileObject;

        this.setEventListeners();
        this.populateText();
    }

    setEventListeners() {
        document.addEventListener("keydown", () => this.textAreaInput.focus());
        this.textAreaInput.addEventListener("keydown", (e) => {
            this.handleKeydown(e.key);
        });
    }

    reset() {
        this.hideResults();

        this.currentLetterIndex = 0;

        this.isRunning = false;
        this.isDisplayingResults = false;

        this.startTime = 0;
        this.endTime = 0;

        this.correctKeysTyped = 0;
        this.keysTyped = 0;

        this.wordObjects = [];
        this.letterObjects = [];

        this.textAreaText.innerHTML = "";

        this.populateText();
    }

    start() {
        this.isRunning = true;
        this.isDisplayingResults = false;

        this.startTime = new Date();
    }

    stop() {
        this.isRunning = false;
        this.isDisplayingResults = true;

        this.endTime = new Date();

        this.showResults();
    }

    populateText() {
        let paragraph = getRandomParagraph();
        let time = 0;

        paragraph.forEach((word) => {
            const wordObject = new Word(word);
            const letters = [...word, " "];

            letters.forEach((letter) => {
                const letterObject = new Letter(letter);
                wordObject.insertLetter(letterObject);
                this.letterObjects.push(letterObject);
            });
            this.wordObjects.push(wordObject);
            setTimeout(() => this.textAreaText.append(wordObject.wordElement), time);
            time += 25;
        });
        this.currentLetterObject = this.letterObjects[0];
        this.currentLetterObject.addCursor();
    }

    handleKeydown(key) {
        if (!this.isRunning && !this.isDisplayingResults) {
            this.start();
        }

        if (this.isRunning && this.currentLetterIndex < this.letterObjects.length - 1) {
            this.checkInput(key);
        }

        if (this.isRunning && this.currentLetterIndex == this.letterObjects.length - 1) {
            this.stop();
        }
    }

    checkInput(key) {
        if (ignoredKeys.includes(key))
            return;

        if (key === "Backspace") {
            return this.setLastKey();
        }

        this.keysTyped++;

        if (key === this.currentLetterObject.letter) {
            this.currentLetterObject.setCorrect();
            this.Keyboard.triggerKey(true, key.toLowerCase());
            this.correctKeysTyped++;
        } else {
            this.currentLetterObject.setIncorrect();
            this.Keyboard.triggerKey(false, key.toLowerCase());
        }

        this.setNextKey();
    }

    setNextKey() {
        this.currentLetterObject.removeCursor();
        this.currentLetterIndex++;
        this.currentLetterObject = this.letterObjects[this.currentLetterIndex];
        this.currentLetterObject.addCursor();
    }

    setLastKey() {
        if (this.currentLetterIndex > 0) {
            this.currentLetterObject.removeCursor();
            this.currentLetterIndex--;
            this.currentLetterObject = this.letterObjects[this.currentLetterIndex];
            this.currentLetterObject.addCursor();
            this.currentLetterObject.setUntyped();
        }
    }

    calculateWPM() {
        let correctWords = 0;

        for (let i = 0; i < this.wordObjects.length; i++) {
            let typedCorrect = true;
            let wordObject = this.wordObjects[i];
            let letterObjects = wordObject.letterObjects;

            for (let j = 0; j < letterObjects.length; j++) {
                let letterObject = letterObjects[j];
                let letter = letterObject.letter;

                if (!punctuationOrSpace.includes(letter) && !letterObject.isCorrect()) {
                    typedCorrect = false;
                    break;
                }
            }

            correctWords += typedCorrect;
        }

        let timeTakenSeconds = this.calculateTimeTaken();
        let WPM = correctWords / (timeTakenSeconds / 60);
        let WPMrounded = Math.round(WPM, 1);
        return WPMrounded;
    }

    calculateAccuracy() {
        let accuracyPercent = (this.correctKeysTyped / this.keysTyped) * 100;
        let accuracyRounded = Math.round(accuracyPercent, 0);
        let accuracyFormatted = accuracyRounded + "%";
        return accuracyFormatted;
    }

    calculateTimeTaken() {
        return (this.endTime - this.startTime) / 1000;
    }

    showResults() {
        let WPM = this.calculateWPM();
        let accuracy = this.calculateAccuracy();
        let time = Math.round(this.calculateTimeTaken(), 1) + "s";

        this.WPM.displayResult(WPM, 0);
        this.Accuracy.displayResult(accuracy, 50);
        this.Time.displayResult(time, 100);
    }

    hideResults() {
        this.WPM.hideResult(100);
        this.Accuracy.hideResult(50);
        this.Time.hideResult(0);
    }
}