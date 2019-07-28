export interface GameObject {
  name: string;
  health: number;
}

export class Thing implements GameObject {
  name: string;
  health: number;
  constructor(name: string, health: number) {
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

  kill () {
    console.info(`${this.name} has died of its wounds.`)
  }
}

export class Character extends Thing {
  attack (target: Character) {
    target.hit(1)
  }

}

export class Player extends Character {}
