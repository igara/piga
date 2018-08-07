require('isomorphic-fetch')
require('babel-polyfill')

const {spawn, execSync} = require('child_process')
const irw = spawn('irw')
const RssParser = require('rss-parser')
const {env} = require('./env')

// 埼玉のテレビ テレ玉取得のため
const saitamaChannel = 'https://tv.so-net.ne.jp/rss/schedulesByCurrentTime.action?group=10&stationAreaId=29'
// 神奈川のテレビ tvk取得のため
const kanagawaChannel = 'https://tv.so-net.ne.jp/rss/schedulesByCurrentTime.action?group=10&stationAreaId=24'
// 千葉のテレビ チバテレビ取得のため
const tibaChannel = 'https://tv.so-net.ne.jp/rss/schedulesByCurrentTime.action?group=10&stationAreaId=27'
// 東京のテレビ
const tokyoChannel = 'https://tv.so-net.ne.jp/rss/schedulesByCurrentTime.action?group=10&stationAreaId=23'

console.info('run ir_bot')

irw.stdout.on('data', async (data) => {
  let signal = data.toString()
  signal = signal.replace(/\S* \S* /, '').replace(/ regza/, '')
  console.log(`stdout: ${data}`)
  console.log(signal)
  if (isFinite(+signal) && +signal === 3) {
    // 

  } else if (isFinite(+signal)) {
    const parser = new RssParser()
    const json = await parser.parseURL(tokyoChannel)
    const channel = json.items.find(item => {
      const regexp = new RegExp(`\\(Ch\\.${+signal}\\)`)
      return item.content.match(regexp)
    })
    if (typeof channel === 'undefined') {

    } else {
      await fetch(env.discord_webhook, {
        body: JSON.stringify({
          username: 'piga',
          avatar_url: env.avatar_url,
          content: `${channel.content}\r
${channel.title}\r
${channel.link}\r
を見ています。
          `
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
    }
  }
})

irw.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`)
})

irw.on('close', (code) => {
  console.log(`child process exited with code ${code}`)
})
