<template>
  <selection class="container posts-page">
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
        <el-table-column prop="user.id" label="作成者" width="180" />
        <el-table-column prop="created_at" label="作成日時" width="240" />
      </el-table>
    </el-card>
  </selection>
</template>

<script>
// import moment from '~/plugins/moment'
import { mapGetters } from 'vuex'

export default {
  async asyncData ({ store }) {
    // await store.dispatch('posts/fetchPosts')
  },
  computed: {
    showPosts () {
      return [
        {
        id: '001',
        title: 'title1',
        body: 'body1',
        created_at: '2019/04/11 12:00:00',
        user: {
          id: 'unokun'
        }
        },
        {
        id: '002',
        title: 'title1',
        body: 'body1',
        created_at: '2019/04/11 12:00:00',
        user: {
          id: 'unokun'
        }
        }
      ]
      /*
      return this.posts.map (post => {
        post.created_at = moment(post.created_at).format('YYYY/MM/DD HH:mm:ss')
        return post
      })
      */
    },
    // ...mapGetters('posts', ['posts'])
  },
  methods: {
    handleClick(post) {
      // this.$route.push(`/posts/${post.id}`)
    }
  }
}
</script>

<style>
.posts-page .el-table__row {
  cursor: pointer;
}
</style>