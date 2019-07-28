import { GameState } from "./GameState"
import { Player, Character } from "./Objects"
const readline = require("readline")

let gameState: GameState;
let rl;

function CharacterSpawner (args: any[]) {
  var newInstance = Object.create(Character.prototype);
  newInstance.constructor.apply(newInstance, args);
  return newInstance;
}

// TODO: Add better parsing and help, perhaps with yargs
const commands = {
  look: {
    fn: () => {
      if (gameState.objects.length === 0) {
        console.log('You see nothing')
      } else {
        console.log('You see:')
        console.log(gameState.objects.map(o => o.name).join(', '))
      }
    }
  },
  inspect: {
    fn: (...args) => {
      let name:string = args.join(' ')
      let object = gameState.objects.find(item => item.name === name)
      if (object) {
        console.log(object.inspect())
      } else {
        console.log(`Could not find ${name}, try using 'look' to see what is around you.`)
      }
    }
  },
  attack: {
    fn: (...args) => {
      let name:string = args.join(' ')
      let target = gameState.objects.find(item => item.name === name)
      if (target && target instanceof Character) {
        gameState.player.attack(target)
      } else {
        console.log(`${name} cannot be attacked.`)
      }
    }
  },
  save: {
    fn: save()
  },
  exit: {
    fn: () => {
      console.log('Bye bye.')
      process.exit(0)
    }
  },
  help: {
    fn: () => {
      console.log(Object.keys(commands).join(', '))
    }
  },

  // Dev helper stuff
  create: {
    fn: (...args) => {
      let health:number = parseInt(args.pop())
      let name:string = args.join(' ')
      let thing = CharacterSpawner([name, health])
      console.log(`Created ${thing.name} with ${thing.health} health.`)
      gameState.addObject(thing)
    }
  }
}

/**
 * The entry point for the game
 */
async function main () {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  rl.on('line', async (input: string) => {
    let args = input.split(' ')
    let cmd = commands[args.shift().toLocaleLowerCase()]
    if (cmd) {
      await cmd.fn.apply(null, args)
    } else {
      console.log('Command unknown, try typing help for a list of actions.')
    }

    // Always display the prompt when the action is done
    rl.prompt()
  })

  rl.on('SIGINT', save('SIGINT'))

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

  // Show the user prompt
  rl.prompt()
}

/**
 * Saves the GameState and then exits the process if `signal` is set
 */
function save (signal?: NodeJS.Signals) {
  return async () => {
    console.log(`Saving game...`)
    await gameState.save()
    if (signal) {
      console.log('All done, bye bye')
      process.exit(0)
    } else {
      console.log('Game saved.')
    }
  }
}

// Run the game
(async () => {
  await main()
})()

