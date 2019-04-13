<template>
  <section class="container todos-page">
    <div style="flex: 1;">
      <el-card v-if="todo">
        <div slot="header" class="clearfix">
          <h2>{{todo.title}}</h2>
        </div>
        <p>{{todo.body}}</p>
        <p class="text-right">{{todo.created_at | time}}</p>
      </el-card>
      <p>
        <nuxt-link to="/todos">&lt; TODO一覧に戻る</nuxt-link>
      </p>
    </div>
  </section>
</template>
<script>
import moment from '~/plugins/moment'
import { mapGetters, mapActions } from 'vuex'

export default {
  async asyncData ({ store, route, error }) {
    try {
      if (!(store.getters['todos'].find(t => t.id === route.params.id))) {
        throw new Error('todo not found')
      }
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  computed: {
    todo() {
      return this.todos.find(t => t.id === this.$route.params.id)
    },
    ...mapGetters(['todos'])
  },
  filters: {
    time(val) {
      return moment(val).format('YYYY/MM/DD HH:mm:ss')
    }
  }
}
</script>

<style>
.todo-page .el-table__row {
  cursor: pointer;
}
</style>
