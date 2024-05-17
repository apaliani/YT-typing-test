export default class Word {
    constructor(word) {
        this.word = word;
        this.wordElement = this.getWordTemplate();
        this.letterObjects = [];
    }

    getWordTemplate() {
        return document.querySelector("#word-template").content.querySelector(".word").cloneNode(true);
    }

    insertLetter(letterObj) {
        this.letterObjects.push(letterObj);
        this.wordElement.append(letterObj.letterElement);
    }
}