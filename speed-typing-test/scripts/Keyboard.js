import { keys, validInputKeys } from "./constants.js";
import Key from "./Key.js";

export default class KeyboardEvent {
    constructor() {
        this.keyObjects = {};
        this.createKeys();
    }

    createKeys() {
        Array.from(keys).forEach((key) => {
            const keyText = key.querySelector(".key__text").textContent.trim();
            this.keyObjects[keyText] = new Key(key);
        });
    }

    triggerKey(correctKey, key) {
        if (key === " ")
            key = "space";

        if (!this.keyObjects[key])
            return;

        this.keyObjects[key].triggerKey(correctKey, key);
    }
}