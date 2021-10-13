import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/auth'
import router from '@/router'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'onestoop', // The key to store the state on in the storage provider.
  storage: window.localStorage // or window.sessionStorage or localForage
})

const store = new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
  state: {
    activeVehicle: null,
    editVehicle: null,
    vehiclesLoading: false,
    vehicles: {"vehicles":[]},
    error: null,
    loading: false,
    user: null,
    profile: null,
    token: null,
    tmp: null
  },
  mutations: {
    setActiveVehicle (state, payload) {
      state.activeVehicle = payload
    },
    setEditVehicle (state, payload) {
      console.log("running setEditVehicle")
      state.editVehicle = payload
    },
    setVehiclesLoading(state, payload) {
      state.vehiclesLoading = payload
    },
    setVehicles(state, payload) {
      state.vehicles = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setProfile (state, payload) {
      state.profile = payload
    },
    setToken (state, payload) {
      state.token = payload
    },
    setUser (state, payload) {
      state.user = payload
    },
    setTmp (state, payload) {
      state.tmp = payload
    }
  },
  actions: {
    autoSignIn ({ commit }, payload) {
      commit('setUser', { email: payload.email, uid: payload.uid })
    },
    refreshToken ({ commit }) {
      console.log("refreshToken")
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          user.getIdToken(true).then(function(accessToken) {
            commit('setToken', accessToken)
          })
        }
      })
    },
    userSignIn ({ commit }, payload) {
      commit('setLoading', true)
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .catch( error => {
          console.log(error)
          commit('setUser', null)
        })
        .then( data => {
          console.log(data)
          firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
            .catch(error => {
              commit('setError', error.message)
              commit('setLoading', false)
              firebase.auth().signOut()
              commit('setUser', null)
            })
            .then(firebaseUser => {
              commit('setToken', firebaseUser.user._lat)
              var auth = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': store.state.token }
              }
              axios.get(process.env.VUE_APP_API_SERVER + 'users?email=' + firebaseUser.user.email, auth)
                .catch( error => {
                  console.log(error)
                  firebase.auth().signOut()
                  commit('setUser', null)
                })
                .then(response => {
                  console.log(response.data)
                  commit('setProfile', response.data)
                  commit('setUser', { email: firebaseUser.user.email, uid: firebaseUser.user.uid })
                  commit('setLoading', false)
                  commit('setError', null)
                  console.log('redirecting')
                  this.dispatch('getVehicles')
                  router.push('/')
                })
            })
        })
    },
    userSignOut ({ commit }) {
      firebase.auth().signOut()
      commit('setUser', null)
      commit('setProfile', null)
      commit('setToken', null)
      commit('setVehicles', null)
      router.push('/')
    },
    getVehicles ({ commit }) {
      function doGet (vm, count, objectLength) {
        console.log("running getVehicles")
        var auth = {
          headers: { 'Content-Type': 'application/json', 'Authorization': store.state.token }
        }

        axios.get(process.env.VUE_APP_AUTO_API_SERVER + 'vehicles', auth)
          .then(response => {
            console.log(response)
            if (response.data.status === "expired") {
              if (count < 3) {
                count++
                store.dispatch('refreshToken')
                setTimeout(doGet(count), 1000)
              }
              else {
                if ('vehicles' in  response.data) {
                  commit('setVehicles', response.data)
                  commit('setVehiclesLoading', false)

                  objectLength = Object.keys(response.data.vehicles).length
                  if (objectLength === 0) {
                    router.push('inventory');
                  }
                }
              }
            }
            else {
              if ('vehicles' in  response.data) {
                commit('setVehicles', response.data)
                commit('setVehiclesLoading', false)

                objectLength = Object.keys(response.data.vehicles).length
                if (objectLength === 0) {
                  router.push('inventory');
                }
              }
            }
          })
      }

      commit('setVehiclesLoading', true)
      var count = 0
      var objectLength = 0
      doGet(this, count, objectLength)
    },
    postVehicles ({ commit }, data) {
      var auth = {
        headers: { 'Content-Type': 'application/json', 'Authorization': store.state.token }
      }
      console.log(data)
      axios.post(process.env.VUE_APP_AUTO_API_SERVER + 'vehicles', data, auth)
        .then(response => {
          commit('setVehicles', response.data)
        })
        .catch(function () {
          console.log("there was an error")
        })
    },
    editVehicles ({ commit }, data) {
      var auth = {
        headers: { 'Content-Type': 'application/json', 'Authorization': store.state.token }
      }
      console.log(data)
      axios.post(process.env.VUE_APP_AUTO_API_SERVER + 'vehicles/' + data.vid, data, auth)
        .then(response => {
          console.log(response)
          commit('setTmp', null)
          this.dispatch('getVehicles')
        })
        .catch(function () {
          console.log("there was an error")
        })
    }
  },
  getters: {
    isAuthenticated: state => {
      return state.user !== null && state.user !== undefined
    },
    isNotAuthenticated: state => {
        if (state.user !== null && state.user !== undefined) {
          return false
        }
        else {
          return true
        }
    },
    profile: state => {
      return state.profile
    },
    token: state => {
      if (state.user !== null && state.user !== undefined && state.user !== null && state.token !== undefined) {
        return state.token
      } else {
        return null
      }
    },
    user: state => {
      return state.user
    },
    userMenuItems: state => {
      console.log(state)
      if (state.user === null) {
        return []
      }
      else {
        //         var userId = state.profile._id.split("/")
        var userId = state.profile.uid
        var items = [
          { title: "My Profile", to: "/profile/" + userId},
          { title: "My Vehicles", to: "/inventory"},
          { title: "Sign Out", to: "/signout"}
        ]
        return items
      }
    },
    vehiclesList: state => {
      var data = state.vehicles

      return data
    },
    getVehicleToEdit: state => {
        var data = []
        state.editVehicle

        if (!("type" in data)) {
          data.type = 0
        }

        if (data.type == "car") {
          data.type = 0
        } else if (data.type == "truck") {
          data.type = 1
        } else if (data.type == "motorcycle") {
          data.type = 2
        } else if (data.type == "other") {
          data.type = 3
        }

        if (!("units" in data)) {
          data.units = 0
        }

        if (data.units == "mi") {
          data.units = 0
        } else if (data.units == "km") {
          data.units = 1
        }

        return data
    },
    vehiclesLength: state => {
      var objectLength = Object.keys(state.vehicles.vehicles).length
      return objectLength
    }
  }
})
export default store
