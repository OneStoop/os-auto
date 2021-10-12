<template>
  <v-container fluid>
Fueling
    <v-card>

    </v-card>

  </v-container>
</template>

<script>
export default {
  name: 'Home',
  metaInfo: {
      title: 'Auto - One Stoop',
      // override the parent template and just use the above title only
      titleTemplate: null
    },
  data () {
    return {

    }
  },
  methods: {
    autoRefreshToken () {
      this.$store.dispatch('refreshToken')
    }
  },
  mounted () {
    let vm = this
    this.$store.dispatch('getVehicles')
    this.autoRefreshToken()
    setTimeout(function () { vm.$store.dispatch('refreshToken') }, 3300000)
  },
  beforeDestroy: function () {
  }
}
</script>
