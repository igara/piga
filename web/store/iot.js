import axios from 'axios'

export const state = () => ({
  devices: []
})

export const mutations = {
  setDevices(state, devices) {
    state.devices = devices
  },
  setTurn(state, devices) {
    state.devices = devices
  }
}

export const actions = {
  async getDevices({ commit }) {
    try {
      const sessionId = this.$cookies.get('connect.sid')
      const devices = await this.$axios.$get(
        process.env.WEB_ENV === 'local'
          ? '/api/iot'
          : 'https://piga.syonet.work/api/iot',
        {},
        { headers: { token: `connect.sid=${sessionId}` } }
      )
      commit('setDevices', devices.devices)
    } catch (error) {
      console.log(error)
    }
  },
  async fetchTurn({ commit }, param) {
    try {
      const sessionId = this.$cookies.get('connect.sid')
      const devices = await this.$axios.$post(
        process.env.WEB_ENV === 'local'
          ? '/api/iot'
          : 'https://piga.syonet.work/api/iot',
        {
          ip: param.ip,
          turn: param.turn
        },
        { headers: { token: `connect.sid=${sessionId}` } }
      )
      commit('setTurn', devices.devices)
    } catch (error) {
      console.log(error)
    }
  }
}
