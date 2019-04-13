<template>
  <section class="container todos-page">
    <el-card>
      <div slot="header" class="clearfix">
        <span>TODO一覧</span>
      </div>
      <el-table
        :data="showTodos"
        style="width: 100%"
        @row-click="handleClick"
        class="table"
        >
        <el-table-column prop="title" label="タイトル" />
        <el-table-column prop="body" label="詳細" />
        <el-table-column prop="created_at" label="作成日時" width="240" />
      </el-table>
    </el-card>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from '~/plugins/moment'
import Cookies from 'universal-cookie'
import firebase from '~/plugins/firebase'

export default {
  async asyncData({ redirect, store }) {
      const user = store.getters['user']
      store.dispatch('getUserPosts', {user})
  },
  computed: {
    showTodos () {
      if (this.todos.length === 0) {
        return []
      }
      return this.todos.map (todo => {
        todo.created_at = moment(todo.created_at).format('YYYY/MM/DD HH:mm:ss')
        return todo
      })
    },
    ...mapGetters(['user', 'todos'])
  },
  methods: {
    handleClick(todo) {
      this.$router.push(`/todos/${todo.id}`)
    },
  }

}


</script>

<style>
.todos-page .el-table__row {
  cursor: pointer;
}
</style>