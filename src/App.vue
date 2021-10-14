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
      <v-app-bar-nav-icon>
        <a href="/" class="white--text" style="text-decoration: none">
          <v-img width ="50" height="50" src="@/assets/logo.png"></v-img>
        </a>
      </v-app-bar-nav-icon>
      <v-toolbar-title
        style="width: 350px"
        v-if="this.$store.getters.isAuthenticated"
      >
        <v-dialog
          v-model="selectVehicleDialog"
          persistent
          max-width="600"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              light
              v-bind="attrs"
              v-on="on"
            >
              {{ selectVehicleButton }}
              <v-icon
                right
                dark
                large
              >
                mdi-chevron-down
              </v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="display-1">
              Vehicles
              <v-spacer></v-spacer>
              <v-btn
                icon
                color="primary"
                @click="selectVehicleDialog = false"
              >
                <v-icon large>
                  mdi-close
                </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        VID
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in vm.$store.getters.vehiclesList"
                      :key="item.vid"
                    >
                      <td>{{ item.vid }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="selectVehicleDialog = false"
              >
                Cancle
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar-title>

      <v-spacer />

      <v-btn text small v-if="this.$store.getters.isNotAuthenticated" :to="'/signin/'">Sign In</v-btn>
      <div v-if="this.$store.getters.isNotAuthenticated">|</div>
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
      <router-view></router-view>
    </v-main>


    <v-menu
      top
      offset-y
      v-model="fab"
      v-if="this.$store.getters.isAuthenticated"
    >
      <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-model="fab"
            color="green darken-2"
            dark
            fab
            v-bind="attrs"
            v-on="on"
            class="mb-2"
            large
            :style="{left: '50%', transform:'translateX(-50%)'}"
          >
            <v-icon v-if="fab">
              mdi-close
            </v-icon>
            <v-icon v-else>
              mdi-plus
            </v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-icon>
              <v-btn
                fab
                dark
                small
                color="green"
                to="/fueling"
              >
                <v-icon>mdi-gas-station</v-icon>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-title>
              <router-link :to="'/fueling'" style="text-decoration: none;">
                Fueling
              </router-link>
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-btn
                fab
                dark
                small
                color="indigo"
              >
                <v-icon>mdi-oil-level</v-icon>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-title>Service</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-btn
                fab
                dark
                small
                color="red"
              >
                <v-icon>mdi-credit-card-minus</v-icon>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-title>Expence</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-btn
                fab
                dark
                small
                color="green"
              >
                <v-icon>mdi-credit-card-plus</v-icon>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-title>Income</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-btn
                fab
                dark
                small
                color="orange"
              >
                <v-icon>mdi-alarm</v-icon>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-title>Reminder</v-list-item-title>
          </v-list-item>
        </v-list>

    </v-menu>


    <!-- small display -->
    <v-footer
      color="primary lighten-1"
      padless
      dark
      class="hidden-md-and-up"
    >
      <v-row
        justify="center"
        no-gutters
      >
        <div class="d-flex flex-column align-center mx-2 mt-2">
          <v-btn
            fab
            light
            x-small
          >
            <v-icon>mdi-alarm</v-icon>
          </v-btn>
          Reminder
        </div>
        <div class="d-flex flex-column align-center mx-2 mt-2">
          <v-btn
            fab
            light
            x-small
          >
            <v-icon>mdi-chart-bar</v-icon>
          </v-btn>
          Reports
        </div>
        <div class="d-flex flex-column align-center mx-2 mt-2">
          <v-btn
            fab
            light
            x-small
            to="/inventory"
          >
            <v-icon>mdi-car-cog</v-icon>
          </v-btn>
          <router-link :to="'/inventory'" style="text-decoration: none;">
                Inventory
          </router-link>
        </div>
        <div class="d-flex flex-column align-center mx-2 mt-2">
          <v-btn
            fab
            light
            x-small
          >
            <v-icon>mdi-cog</v-icon>
          </v-btn>
          Settings
        </div>
      </v-row>
    </v-footer>

    <!-- big display -->
    <v-footer
      color="primary lighten-1"
      padless
      dark
      class="hidden-sm-and-down"
    >
      <v-row
        justify="center"
        no-gutters
      >
        <div class="d-flex flex-column align-center mx-6 mt-2">
          <v-btn
            fab
            light
          >
            <v-icon>mdi-format-list-bulleted-square</v-icon>
          </v-btn>
          Log
        </div>
        <div class="d-flex flex-column align-center mx-6 mt-2">
          <v-btn
            fab
            light
          >
            <v-icon>mdi-alarm</v-icon>
          </v-btn>
          Reminder
        </div>
        <div class="d-flex flex-column align-center mx-6 mt-2">
          <v-btn
            fab
            light
          >
            <v-icon>mdi-chart-bar</v-icon>
          </v-btn>
          Reports
        </div>
        <div class="d-flex flex-column align-center mx-6 mt-2">
          <v-btn
            fab
            light
            to="/inventory"
          >
            <v-icon>mdi-car-cog</v-icon>
          </v-btn>
          <router-link :to="'/inventory'" style="text-decoration: none; color: inherit;">
                Inventory
          </router-link>
        </div>
        <div class="d-flex flex-column align-center mx-6 mt-2">
          <v-btn
            fab
            light
          >
            <v-icon>mdi-cog</v-icon>
          </v-btn>
          Settings
        </div>
      </v-row>
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
      activeBtn: 1,
      fab: false,
      selectVehicleDialog: false,
      selectVehicleButton: "Select Vehicle",
      testList: [{"vid": 1234}]
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
