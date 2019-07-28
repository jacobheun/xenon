import { GameState } from "./GameState"
import { Player } from "./Objects"

async function main () {
  console.log('Loading Game State...')
  let gameState = new GameState()
  await gameState.load()

  if (gameState.player) {
    console.log('Game Loaded')
  } else {
    let player = new Player('Jake', 10)
    gameState.addObject(player)
    console.log(`Created ${player.name} with ${player.health} health.`)
  }

  console.log('Saving Game...')
  await gameState.save()
  console.log('Add done, bye bye')
}

(async () => {
  await main()
})()

