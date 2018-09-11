const readline = require('readline')

module.exports = async (question, info, warn, error) => {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question(`${question}\n[Yes/no]`, (answer) => {
    if (answer === 'Yes') {
      return 1
    } else if (answer === 'no') {
      return 0
    } else {
      error(`Answer ${answer} is not "Yes" or "no"`)
      return 2
    }
  })
}
