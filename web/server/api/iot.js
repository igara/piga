const express = require('express')
const { Client } = require('tplink-smarthome-api')
const { execSync } = require('child_process')
const axios = require('axios')

const app = express()
const client = new Client()

app.get('/', async (req, res) => {
  const tpLinkIps = process.env.TPLINK_IPS.split(',')

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
  const devices = []
  try {
    for (const ip of tpLinkIps) {
      const device = await client.getDevice({ host: ip })
      const sysInfo = await device.getSysInfo()
      const powerState = await device.getPowerState()
      sysInfo.power_state = powerState
      sysInfo.ip = ip
      devices.push(sysInfo)
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
  const tpLinkIps = process.env.TPLINK_IPS.split(',')

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
  const devices = []
  try {
    for (const ip of tpLinkIps) {
      if (tpLinkIps === ipAddress) {
        await device.setPowerState(turn)
      }
      const device = await client.getDevice({ host: ip })
      const sysInfo = await device.getSysInfo()
      const powerState = await device.getPowerState()
      sysInfo.power_state = powerState
      sysInfo.ip = ip
      devices.push(sysInfo)
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
