<template>
  <section class="container posts-page">
    <el-card style="flex: 1;">
      <div slot="header" class="clearfix">
        <el-input placeholder="タイトルを入力" v-model="formData.title" />
      </div>
      <div>
        <el-input placeholder="本文を入力..." type="textarea" rows="15" v-model="formData.body" />
      </div>
      <div class="text-right" style="margin-top: 16px;">
        <el-button type="primary" @click="publish" round>
          <span class="el-cion-upload2" />
          <span>publish</span>
        </el-button>
      </div>
    </el-card>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  asyncData ({ redirect, store }) {
    if (!store.getters['user']) {
      redirect ('/')
    }
    return {
      formData: {
        title: '',
        body: ''
      }
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    async publish () {
      const user = this.$store.getters['user']
      const userid = user.id
      const payload = {
        userid,
        ...this.formData
      }
      await this.publishTodo ({ payload })
      this.$router.push ('/todos')
    },
    ...mapActions(['publishTodo'])
  }
}
</script>

<style>
.posts-page .el-table__row {
  cursor: pointer;
}
</style>
