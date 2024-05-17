export default class Tile {
    constructor(tileElement) {
        this.tileElement = tileElement;
        this.tileElementValue = tileElement.querySelector(".tile__value");
    }

    displayResult(result, timeout) {
        setTimeout(() => this.tileElement.classList.add("tile__visible"), timeout);
        this.tileElementValue.textContent = result;
    }

    hideResult(timeout) {
        setTimeout(() => this.tileElement.classList.remove("tile__visible"), timeout);
        this.tileElementValue.textContent = "";
    }
}