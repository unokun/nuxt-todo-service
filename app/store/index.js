import firebase from '~/plugins/firebase'

export const state = () => ({
  isLoggedIn: false,
  user: null
})

export const getters = {
  isLoggedIn: (state) => state.isLoggedIn,
  user: (state) => state.user
}

export const mutations = {
  setUser (state, {user}) {
    state.user = user
    state.isLoggedIn = true
  }
}

export const actions = {
  async setCredential({ commit }, { user }) {
    if (!user) return

    firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
        console.log('token:' + result.credential.accessToken)
      }
      if(result.user){
        console.log('email:' + result.user.email)
      }
    }).catch(function(error) {
      // hanlde error
      console.log(`errorCode: ${error.code}`)
      console.log(`errorMessage: ${error.message}`)
    })
  },
  async googleLogin ({commit}) {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  }
}
