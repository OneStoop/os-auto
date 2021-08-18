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
    error: null,
    loading: false,
    user: null,
    profile: null,
    token: null
  },
  mutations: {
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
      router.push('/')
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
          { title: "My Inventory", to: "/inventory"},
          { title: "Sign Out", to: "/signout"}
        ]
        return items
      }

    }
  }
})
export default store
