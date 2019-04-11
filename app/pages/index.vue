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

export default {
  asyncData ({ redirect, store }) {
    return {
      isCreateMode: false,
      formData: {
        id: ''
      }
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
