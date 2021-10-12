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

    <v-row no-gutters v-if="this.$store.state.recipe.title === ''">
      <v-col cols="12">
        <v-skeleton-loader
          class="ma-4"
          type="card"
        ></v-skeleton-loader>
      </v-col>
    </v-row>

    <!-- big display -->
    <v-card >
      <v-card-title class="display-1">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="addDialog"
          persistent
          max-width="700px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              outlined
              color="green"
              v-bind="attrs"
              v-on="on"
            >
              Add New
            </v-btn>
          </template>
          <v-card>
            <form @submit.prevent="saveNew">
              <v-card-title>
                <span class="text-h5">Add Inventory</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="nickname"
                        label="Nickname (optional)"
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
                      <p>Type</p>
                      <v-btn-toggle v-model="toggleType" mandatory>
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
                        v-model="manufacturer"
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
                        v-model="model"
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
                        v-model="year"
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
                        v-model="unitsToggle"
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
                        v-model="plate"
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
                        v-model="vin"
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
                        v-model="notes"
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
                  @click="clearCloseNewForm"
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
        </v-dialog>
      </v-card-title>
      <v-card-text>
      <v-data-table
        :headers="headers"
        :items="this.$store.state.vehicles.vehicles"
        :search="search"
      >
        <template v-slot:item.updated="{ item }">
          <span>{{ new Date(item.updated * 1000).toLocaleString() }}</span>
        </template>
        <template v-slot:item.active="{ item }">
          <span v-if="item.active === true">Active</span>
          <span v-if="item.active === false">inactive</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            text
            @click="startEdit(item)"
          >
            <v-icon
              small
              class="mr-2"
            >
              mdi-pencil
            </v-icon>
            Edit
          </v-btn>
        </template>
      </v-data-table>
      </v-card-text>
    </v-card>
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
          disabled: true,
          to: '/inventory',
        }
      ],
      headers: [
        {
          text: "Type",
          value: "type"
        },
        {
          text: "Nickname",
          value: "nickname"
        },
        {
          text: "Manufacturer",
          value: "mfg"
        },
        {
          text: "Model",
          value: "model"
        },
        {
          text: "Last Update",
          value: "updated"
        },
        {
          text: "Status",
          value: "active"
        },
        {
          text: "",
          value: "actions",
          sortable: false
        }
      ],
      manufacturer: null,
      model: null,
      year: null,
      nickname: null,
      units: "mi",
      vin: null,
      plate: null,
      notes: null,
      search: '',
      toggleType: null,
      unitsToggle: 0
    }
  },
  methods: {
    autoRefreshToken () {
      this.$store.dispatch('refreshToken')
    },
    clearCloseNewForm () {
      this.addDialog = false
      this.manufacturer = null
      this.model = null
      this.year = null
      this.nickname = null
      this.units = "mi"
      this.vin = null
      this.plate = null
      this.notes = null
      this.toggleType = null
    },
    saveNew () {
      console.log("doing saveNew")
      var thisType = ''
      if (this.toggleType == 0) {
        thisType = "car"
      } else if (this.toggleType == 1) {
        thisType = "truck"
      } else if (this.toggleType == 2) {
        thisType = "motorcycle"
      } else if (this.toggleType == 3) {
        thisType = "other"
      }

      var data = {
        type: thisType,
        nickname: this.nickname,
        mfg: this.manufacturer,
        model: this.model,
        year: this.year,
        units: this.units,
        vin: this.vin,
        notes: this.notes,
        status: "active"
      }

      this.$store.dispatch('postVehicles', data)

      this.clearCloseNewForm()
    },
    startEdit (item) {

      this.$store.commit('setEditVehicle', item)
      router.push('/inventory/edit')
    }
  },
  mounted () {
    document.title = "Auto - One Stoop"
    let vm = this
    this.autoRefreshToken()
    setTimeout(function () { vm.$store.dispatch('refreshToken') }, 3300000)
    this.$store.dispatch('getVehicles')
  },
  beforeDestroy: function () {
  }
}
</script>
