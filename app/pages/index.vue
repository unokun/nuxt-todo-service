<template>
  <section class="container">
    <el-card style="flex; 1">
      <div slot="header" class="clearfix">
        <span>ログイン</span>
      </div>
      <div class="text-right">
        <el-button type="primary" @click="googleLogin">googleでログインする</el-button>
      </div>
    </el-card>
  </section>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import firebase from '~/plugins/firebase'
import Cookies from 'universal-cookie'

export default {
  async asyncData ({ redirect, store }) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const { uid, displayName, email } = user
        console.log('uid:' + uid)
        console.log('email:' + email)
        console.log('displayName:' + displayName)
        store.dispatch ('setUser', { user: { id: uid, name: displayName, email: email }})

        const cookies = new Cookies()
        const cookie = {id: uid, name: displayName, email: email}
        cookies.set('user', JSON.stringify(cookie))
        redirect('/todos')
      }
    })
    return {
    }
  },
  computed: {
  },
  methods: {
    ...mapActions(['googleLogin'])
  }
}
</script>

<style>
.form-content {
  margin: 16px 0;
}
</style>
