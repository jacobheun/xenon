import { GameState } from "./GameState"
import { Player } from "./Objects"

let gameState: GameState;

function gameLoop () {
  setTimeout(gameLoop, 0)
}

async function main () {
  process.on('SIGTERM', save('SIGTERM'))
  process.on('SIGINT', save('SIGINT'))

  console.log('Loading Game State...')
  gameState = new GameState()
  await gameState.load()

  if (gameState.player) {
    console.log('Game Loaded')
  } else {
    let player = new Player('Jake', 10)
    gameState.addObject(player)
    console.log(`Created ${player.name} with ${player.health} health.`)
  }

  gameLoop()
}

function save (signal: NodeJS.Signals) {
  return async () => {
    console.log(`\nSaving game...`)
    await gameState.save()
    console.log('All done, bye bye')
    process.exit(0)
  }
}

(async () => {
  await main()
})()

