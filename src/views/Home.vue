<template>
  <v-container fluid>


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
      breadcrumbs: [
        {
          text: 'Dashboard',
          disabled: false,
          href: '/',
        }
      ],
      model: null
    }
  },
  methods: {
    autoRefreshToken () {
      this.$store.dispatch('refreshToken')
    }
  },
  mounted () {
    document.title = "Auto - One Stoop"
    let vm = this
    this.autoRefreshToken()
    setTimeout(function () { vm.$store.dispatch('refreshToken') }, 3300000)
  },
  beforeDestroy: function () {
  }
}
</script>
