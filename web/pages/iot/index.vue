<template>
  <section>
    <div v-for="device in devices" :key="device.mac">
      MAC: {{ device.mac }}, IP: {{ device.ip }}, Type: {{ device.alias }}
      <button
        @click="fetchTurn({
          ip: device.ip,
          turn: !device.power_state
        })"
      >{{ device.power_state ? 'OFF' : 'ON' }}にする</button>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  components: {},
  computed: {
    ...mapState({
      devices: state => state.iot.devices
    })
  },
  fetch({ store, redirect }) {
    if (!store.state.isAdmin) {
      return redirect('/')
    }
  },
  asyncData({ store }) {
    return store.dispatch('iot/getDevices')
  },
  methods: {
    ...mapActions({
      getDevices: 'iot/getDevices',
      fetchTurn: 'iot/fetchTurn'
    })
  }
}
</script>

<style>
</style>
