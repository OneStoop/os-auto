<template>
  <v-container fluid>

    <v-card
      class="mx-auto"
      color="primary"
      max-width="400"
      elevation="2"
      outlined
      shaped
      dark
    >
      <v-card-title
        class="white--text mt-8 justify-center"
      >
        Sign in with
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="4"></v-col>
          <v-col cols="4" class="text-center">
            <v-btn
              @click="googleSignUP()"
              icon
            >
              <v-img
                src="https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png"
              ></v-img>
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="text-center">
            Or
            <v-divider></v-divider>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <form @submit.prevent="userSignIn">
              <v-text-field
                name="email"
                label="Email"
                id="email"
                type="email"
                v-model="email"
                outlined
                required></v-text-field>

              <v-text-field
                name="password"
                label="Password"
                id="password"
                type="password"
                v-model="password"
                outlined
                required></v-text-field>

              <v-btn
                color="white"
                class="black--text"
                large
                type="submit"

              >
                Sign In
              </v-btn>
          </form>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="text-center">
        <p>
          Don't have an account?<br>Join One Stoop where you can save and share your favorite recipes.
          <p>
          <v-btn
            :to="'/signup/'"
            color="white"
            class="black--text"
          >
            Sign Up
          </v-btn>
        </p>
      </v-col>
    </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/auth'
import router from '@/router'
export default {
  data () {
    return {
      email: '',
      password: '',
      alert: false
    }
  },
  methods: {
    userSignIn () {
      this.$store.dispatch('userSignIn', { email: this.email, password: this.password })
    },
    googleSignUP () {
      var provider = new firebase.auth.GoogleAuthProvider()
      var vm = this

      firebase.auth().signInWithPopup(provider)
        .then(function(result) {
          var token = result.user._lat
          var user = result.user
          console.log(result)

          vm.$store.commit('setLoading', false)
          vm.$store.commit('setToken', token)
          axios.post(process.env.VUE_APP_API_SERVER + `users?token=` + token, {
            body: ''
          })
          .then(function() {
            var auth = {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': vm.$store.state.token }
            }
            axios.get(process.env.VUE_APP_API_SERVER + 'users?email=' + user.email, auth)
            .then(function (response) {
              vm.$store.commit('setProfile', response.data)
              vm.$store.commit('setUser', { email: user.email })
            })
            .catch(function () {
              firebase.auth().signOut()
              vm.$store.commit('setUser', null)
            })
          })
          .catch(function() {
            var user = firebase.auth().currentUser
            user.delete().then(function () {
            // User deleted.
            }).catch(function () {})
            vm.$store.commit('setUser', null)
            router.push('/signin')
          })
          router.push('/')
        })
        .catch(function(error) {
          this.$store.commit('setError', error.message)
          this.$store.commit('setLoading', false)
        })
    }
  },
  computed: {
    error () {
      return this.$store.state.error
    },
    loading () {
      return this.$store.state.loading
    }
  },
  watch: {
    error (value) {
      if (value) {
        this.alert = true
      }
    },
    alert (value) {
      if (!value) {
        this.$store.commit('setError', null)
      }
    }
  }
}
</script>
