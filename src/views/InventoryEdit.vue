<template>
  <v-container fluid>
    <v-row no-gutters align="center" justify="center">
      <v-col cols="12">
        <div>
          <v-breadcrumbs
            :items="breadcrumbs"
            large
            ></v-breadcrumbs>
        </div>
      </v-col>
    </v-row>

    <v-row align="center" justify="center" v-if="this.vehicle === null">
      <v-col cols="12">
        <v-skeleton-loader
          class="ma-4"
          type="card"
        ></v-skeleton-loader>
      </v-col>
    </v-row>

    <!-- big display -->
    <v-row align="center" justify="center" class="mb-6" v-if="this.vehicle != null">
    <v-card
      max-width="700px"
    >
      <form @submit.prevent="saveEdit">
      <v-card-text>

          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="vehicle.nickname"
                  label="Nickname (optional)"
                >
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-switch
                  v-model="vehicle.active"
                  label="Active"
                >
                </v-switch>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <p>Type</p>
                <v-btn-toggle v-model="vehicle.type" mandatory>
                  <v-btn>
                    Car
                  </v-btn>
                  <v-btn>
                    Truck
                  </v-btn>
                  <v-btn>
                    Motorcycle
                  </v-btn>
                  <v-btn>
                    Other
                  </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="vehicle.mfg"
                  label="* Manufacturer"
                  required
                >
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="vehicle.model"
                  label="* Model"
                  required
                >
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="vehicle.year"
                  label="Year (optional)"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <p>Units</p>
                <v-btn-toggle
                  v-model="vehicle.units"
                  mandatory
                >
                  <v-btn>
                    Miles (Mi)
                  </v-btn>
                  <v-btn>
                    Kilometer (Km)
                  </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="vehicle.plate"
                  label="License Plate (optional)"
                >
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="vehicle.vin"
                  label="VIN (optional)"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
              >
                <v-textarea
                  label="Notes"
                  v-model="vehicle.notes"
                  auto-grow
                >
                </v-textarea>
              </v-col>
            </v-row>
          </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="blue darken-1"
          text
          :to="'/inventory'"
        >
          Cancle
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          type="submit"
        >
          Save
        </v-btn>
      </v-card-actions>
      </form>
    </v-card>
    </v-row>
  </v-container>
</template>

<script>
import router from '@/router'
export default {
  name: 'Home',
  metaInfo: {
      title: 'Auto - One Stoop',
      // override the parent template and just use the above title only
      titleTemplate: null
    },
  data () {
    return {
      addDialog: false,
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          to: '/',
        },
        {
          text: 'Inventory',
          disabled: false,
          to: '/inventory',
          exact: true
        },
        {
          text: 'Edit',
          disabled: true,
          to: '/inventory/edit',
        }
      ],
      vehicle: null
    }
  },
  methods: {
    autoRefreshToken () {
      this.$store.dispatch('refreshToken')
    },
    clearCloseEdit () {
      this.vehicle = false
      router.push('/inventory')
    },
    saveEdit () {
      console.log("doing saveEdit")
      var thisType = ''
      if (this.vehicle.type == 0) {
        thisType = "car"
      } else if (this.vehicle.type == 1) {
        thisType = "truck"
      } else if (this.vehicle.type == 2) {
        thisType = "motorcycle"
      } else if (this.vehicle.type == 3) {
        thisType = "other"
      }

      var data = this.vehicle
      data.type = thisType

      console.log(data)

      this.$store.dispatch('editVehicles', data)

      this.clearCloseEdit()
    },
    loadData () {
      this.vehicle = this.$store.getters.getVehicleToEdit
    }
  },
  mounted () {
    document.title = "Auto - One Stoop"
    let vm = this
    this.autoRefreshToken()
    setTimeout(function () { vm.$store.dispatch('refreshToken') }, 3300000)
    this.loadData()
  },
  beforeDestroy: function () {
    this.$store.commit('setEditVehicle', null)
  }
}
</script>
