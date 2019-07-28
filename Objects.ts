import { GameState } from "./GameState";

export interface GameObject {
  name: string;
  health: number;
  gameState: GameState;
  inspect(): string;
  toJSON(): any;
}

export class Thing implements GameObject {
  name: string;
  health: number;
  gameState: GameState;
  constructor(gameState: GameState, name: string, health: number) {
    this.gameState = gameState
    this.name = name
    this.health = health
  }

  /**
   * Receives the specified number of damage and logs it
   */
  hit (damage: number) {
    this.health -= damage
    console.info(`${this.name} was hit for ${damage}. Current health is ${this.health}.`)
    if (this.health <= 0) {
      this.kill()
    }
  }

  inspect () {
    return `${this.name} has ${this.health} health.`
  }

  /**
   * Removes the object from its GameState
   */
  kill () {
    console.info(`${this.name} has died of its wounds.`)
    this.gameState.destroy(this)
  }

  /**
   * Allows us to only serialize the things we need
   */
  toJSON () {
    return {
      name: this.name,
      health: this.health
    }
  }
}

export class Character extends Thing {
  attack (target: Character) {
    target.hit(1)
  }
}

export class Player extends Character {}
