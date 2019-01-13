const express = require('express')
const { Client } = require('tplink-smarthome-api')
const { execSync } = require('child_process')
const axios = require('axios')

const app = express()
const client = new Client()
const tpLinkMacs = process.env.TPLINK_MACS.split(',')
const ipRegexp = /\d+.\d+.\d+.\d+/
const macRegexp = /\S+:\S+:\S+:\S+/

app.get('/', async (req, res) => {
  const execArp = execSync('arp -a').toString()
  const arpLine = execArp.split('\n')

  const token = req.headers.token
  if (token) {
    try {
      const fetchAdmin = await axios.post(
        `${process.env.SYONET_URL}/api/auth/admin/check`,
        {},
        {
          headers: { token }
        }
      )
      if (fetchAdmin.data.status !== 200 || fetchAdmin.data.message !== 'OK') {
        console.error(error)
        res.status(500)
        return res.send({
          status: 500,
          message: 'NG'
        })
      }
    } catch (error) {
      console.error(error)
      res.status(500)
      return res.send({
        status: 500,
        message: 'NG'
      })
    }
  }
  const arps = {}
  const devices = []
  try {
    for (const line of arpLine) {
      const macMatch = line.match(macRegexp)
      if (macMatch && macMatch.length > 0 && tpLinkMacs.includes(macMatch[0])) {
        const ipMatch = line.match(ipRegexp)
        const ip = ipMatch[0]
        const device = await client.getDevice({ host: ip })
        const sysInfo = await device.getSysInfo()
        const powerState = await device.getPowerState()
        sysInfo.power_state = powerState
        sysInfo.ip = ip
        devices.push(sysInfo)
      }
    }
  } catch (error) {
    console.error(error)
    res.status(500)
    return res.send({
      status: 500,
      message: 'NG'
    })
  }
  return res.json({
    devices
  })
})

app.post('/', async (req, res) => {
  const execArp = execSync('arp -a').toString()
  const arpLine = execArp.split('\n')

  const token = req.headers.token
  if (token) {
    try {
      const fetchAdmin = await axios.post(
        `${process.env.SYONET_URL}/api/auth/admin/check`,
        {},
        {
          headers: { token }
        }
      )
      if (fetchAdmin.data.status !== 200 || fetchAdmin.data.message !== 'OK') {
        res.status(500)
        return res.send({
          status: 500,
          message: 'NG'
        })
      }
    } catch (error) {
      console.error(error)
      res.status(500)
      return res.send({
        status: 500,
        message: 'NG'
      })
    }
  }
  if (
    !req.body['ip'] ||
    req.body['turn'] === null ||
    req.body['turn'] === undefined ||
    req.body['turn'] === ''
  ) {
    res.status(500)
    return res.send({
      status: 500,
      message: 'NG'
    })
  }
  const ipAddress = req.body['ip']
  const turn = req.body['turn']
  const arps = {}
  const devices = []
  try {
    for (const line of arpLine) {
      const macMatch = line.match(macRegexp)
      if (macMatch && macMatch.length > 0 && tpLinkMacs.includes(macMatch[0])) {
        const ipMatch = line.match(ipRegexp)
        const ip = ipMatch[0]
        const device = await client.getDevice({ host: ip })
        if (ip === ipAddress) {
          await device.setPowerState(turn)
        }
        const sysInfo = await device.getSysInfo()
        const powerState = await device.getPowerState()
        sysInfo.power_state = powerState
        sysInfo.ip = ip
        devices.push(sysInfo)
      }
    }
  } catch (error) {
    console.error(error)
    res.status(500)
    return res.send({
      status: 500,
      message: 'NG'
    })
  }
  return res.json({
    devices
  })
})

module.exports = {
  path: '/api/iot',
  handler: app
}
