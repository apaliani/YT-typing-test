import Input from "./Input.js";
import Keyboard from "./Keyboard.js";
import Reset from "./Reset.js";
import Word from "./Word.js";
import Letter from "./Letter.js";
import Tile from "./Tile.js";

import {
  validInputKeys,
  textAreaInput,
  resetButton,
  paragraphs,
  wpmTile,
  accuracyTile,
  timeTile,
} from "./constants.js";

const wpmTileObject = new Tile(wpmTile);
const accuracyTileObject = new Tile(accuracyTile);
const timeTileObject = new Tile(timeTile);

const keyboardObject = new Keyboard();

const inputObject = new Input(keyboardObject, wpmTileObject, accuracyTileObject, timeTileObject);

const resetObject = new Reset(resetButton, inputObject);