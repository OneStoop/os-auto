<style>
.v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>
<template>
  <v-app id="inspire">

    <v-app-bar
      app
      color="primary"
      dark
      class="hidden-md-and-up"
    >

      <v-spacer />
      <router-link :to="'/'" style="text-decoration: none;" class="mr-4">
        <v-icon>home</v-icon>
      </router-link>

      <v-btn text small v-if="this.$store.getters.isNotAuthenticated" :to="'/signin/'">Sign In</v-btn>
      |
      <v-btn text small v-if="this.$store.getters.isNotAuthenticated" :to="'/signup/'">Sign Up</v-btn>


      <v-menu bottom left v-if="this.$store.getters.isAuthenticated">
        <template v-slot:activator="{ on }">
          <v-btn
            dark
            icon
            v-on="on"
          >
            <v-icon>account_circle</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, i) in this.$store.getters.userMenuItems"
            :key="i"
          >
            <v-btn color="info" text :to="item.to">
              {{ item.title }}
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-app-bar>

    <v-app-bar
      app
      color="primary"
      dark
      class="hidden-sm-and-down"
    >
      <v-toolbar-title
        style="width: 350px"
      >
        <a href="/" class="white--text" style="text-decoration: none">Auto . OS . com</a>
      </v-toolbar-title>

      <v-spacer />

      <v-btn text small v-if="this.$store.getters.isNotAuthenticated" :to="'/signin/'">Sign In</v-btn>
      |
      <v-btn text small v-if="this.$store.getters.isNotAuthenticated" :to="'/signup/'">Sign Up</v-btn>

      <v-menu bottom left v-if="this.$store.getters.isAuthenticated">
        <template v-slot:activator="{ on }">
          <v-btn
            dark
            icon
            v-on="on"
          >
            <v-icon>account_circle</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, i) in this.$store.getters.userMenuItems"
            :key="i"
          >
            <v-btn color="info" text :to="item.to">
              {{ item.title }}
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-bottom-navigation
        :value="activeBtn"
        color="primary"
        horizontal
      >
        <router-link
          to="/"
          class="v-btn">
          <span>Home</span>
        </router-link>

        <router-link
          to="/inventory"
          class="v-btn"
          v-if="this.$store.getters.isAuthenticated"
        >
          <span>My Inventory</span>
        </router-link>

      </v-bottom-navigation>
    </v-main>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer
      color="primary"
      padless
    >
      <v-row>
        <v-col>
        </v-col>
      </v-row>
      <v-spacer />

      <span class="white--text">&copy; 2021</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "Auto-OneStoop",
  metaInfo: {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: '',
      // all titles will be injected into this template
      titleTemplate: '%s | Auto - One Stoop'
  },
  data () {
    return {
      browse: false,
      browseItem: null,
      activeBtn: 1
    }
  },
  computed: {
  },
  methods: {
    autoRefreshToken () {
      this.$store.dispatch('refreshToken')
    },
  },
  beforeUpdate () {
  },
  mounted () {
    let vm = this
    // setTimeout(function () { vm.autoRefreshToken() }, 300000)
    setTimeout(function () { vm.autoRefreshToken() }, 3300000)
  },
  watch: {
  }
}
</script>
