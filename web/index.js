const { Client } = require('tplink-smarthome-api')
const { execSync } = require('child_process')

const client = new Client()
const tpLinkMacs = process.env.TPLINK_MACS.split(',')
const execArp = execSync('arp -a').toString()
const arpLine = execArp.split('\n')
const arps = {}
const ipRegexp = /\d+.\d+.\d+.\d+/
const macRegexp = /\S+:\S+:\S+:\S+/
for (const line of arpLine) {
  const mac = line.match(macRegexp)
  if (mac && mac.length > 0 && tpLinkMacs.includes(mac[0])) {
    const ip = line.match(ipRegexp)
    try {
      client.getDevice({ host: ip }).then(device => {
        device.getSysInfo().then(console.log)
        device.setPowerState(false)
      })
    } catch (error) {
      console.error(error)
    }
  }
}

// Look for devices, log to console, and turn them on
// client.startDiscovery().on('device-new', device => {
//   device.getSysInfo().then(console.log)
//   device.setPowerState(false)
// })
//nmap 192.168.88.0-254
//for i in {1..255}; do sudo arp -d 192.168.88.$i; done
