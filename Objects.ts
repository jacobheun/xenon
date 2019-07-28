export interface GameObject {
  name: string;
  health: number;
}

export class Character implements GameObject {
  name: string;
  health: number;
  constructor(name: string, health: number) {
    this.name = name
    this.health = health
  }
}

export class Player extends Character {}
