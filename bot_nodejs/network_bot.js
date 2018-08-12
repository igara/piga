require('isomorphic-fetch')
require('babel-polyfill')

const {execSync} = require('child_process')
const fs = require('fs')
const {env} = require('./env')

console.info('run network_bot')

const spyNetwork = async () => {
  while (true) {
    const execRemoveArpCache = execSync('ip -s neigh flush all').toString()
    const execNmap = execSync('nmap 192.168.88.0-254').toString()
    const execArp = execSync('arp -a').toString()
    const dir = fs.readdirSync(`${__dirname}/machines`)
    for (let machine of env.machines) {
      const regexp = new RegExp(machine.mac_address)
      const mac_address = machine.mac_address.replace(/:/g, '_')
      const item = dir.find(item => {
        return item === mac_address
      })

      if (typeof item !== 'undefined' && !execArp.match(regexp)) {
        fs.unlinkSync(`${__dirname}/machines/${mac_address}`)
      }
      if (typeof item === 'undefined' && execArp.match(regexp)) {
        fs.writeFileSync(`${__dirname}/machines/${mac_address}`, '')
        await fetch(env.discord_webhook, {
          body: JSON.stringify({
            username: 'piga',
            avatar_url: env.avatar_url,
            content: `${machine.name}\r
を起動しました。
            `
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        })
      }
    }
  }
}

spyNetwork()
