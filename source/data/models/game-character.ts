import { Character } from "./character";
import { IGameCharacter } from "@roll4init/common";

export class GameCharacter extends Character implements IGameCharacter {
	Initiative: number;
}

export default GameCharacter;
