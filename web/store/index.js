import CookieParser from 'cookieparser'
import axios from 'axios'

export const state = () => ({
  isAdmin: false
})

export const mutations = {
  setIsAdmin(state, isAdmin) {
    state.isAdmin = isAdmin
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    const cookies = CookieParser.parse(req.headers.cookie)
    if (cookies.hasOwnProperty('connect.sid')) {
      const sessionId = cookies['connect.sid']
      if (sessionId) {
        try {
          const fetchAdmin = await this.$axios.$post(
            `${process.env.SYONET_URL}/api/auth/admin/check`,
            {},
            {
              headers: { token: `connect.sid=${sessionId}` }
            }
          )
          if (fetchAdmin.status === 200 && fetchAdmin.message === 'OK') {
            commit('setIsAdmin', true)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
  },
  async getIsAdmin({ commit }) {
    const cookies = CookieParser.parse(req.headers.cookie)
    if (cookies.hasOwnProperty('connect.sid')) {
      const sessionId = cookies['connect.sid']
      if (sessionId) {
        try {
          const fetchAdmin = await this.$axios.$post(
            `${process.env.SYONET_URL}/api/auth/admin/check`,
            {},
            {
              headers: { token: `connect.sid=${sessionId}` }
            }
          )
          if (fetchAdmin.status === 200 && fetchAdmin.message === 'OK') {
            commit('setIsAdmin', true)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}
