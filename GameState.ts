import fs = require('fs')
import path = require('path')

import { GameObject, Character, Player } from "./Objects"
import { getDefaultSettings } from 'http2';

const SavePath = path.resolve('./saves/game.json')

export class GameState {
  objects: Array<GameObject> = [];
  player: Player;

  addObject (object: GameObject) {
    if (object instanceof Player) {
      this.player = object
    } else {
      this.objects.push(object)
    }
  }

  destroy (object: GameObject) {
    let index = this.objects.indexOf(object)
    if (index >= 0) {
      this.objects.splice(index, 1)
    }
  }

  async save () {
    await fs.promises.mkdir(path.dirname(SavePath), { recursive: true })
    await fs.promises.writeFile(path.resolve(SavePath), this.serialize())
  }

  async load () {
    try {
      let data = await fs.promises.readFile(path.resolve(SavePath))
      this.deserialize(data)
    } catch (error) {
      console.error(error)
      console.info('Could not load game, a new game will be created.')
    }
  }

  private deserialize (data: Buffer) {
    let state: GameState = JSON.parse(data.toString())
    for (let object of state.objects) {
      this.objects.push(new Character(this, object.name, object.health))
    }
    if (state.player) {
      this.player = new Player(this, state.player.name, state.player.health)
    }
  }

  private serialize (): string {
    return JSON.stringify({
      objects: this.objects,
      player: this.player
    })
  }
}