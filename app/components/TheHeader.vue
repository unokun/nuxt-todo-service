<template>
  <el-menu mode="horizontal" :router="true">
    <el-menu-item index="1" style="pointer-events: none;">
      Nuxt Todo App
    </el-menu-item>
    <el-menu-item idex="2" :route="{ path: '/todos'}">
      TODO一覧
    </el-menu-item>

    <el-menu-item index="4" style="float: right;" :route="{ path: `/users/${user.email}` }" v-if="user">
      <span>{{user.name}}</span>
    </el-menu-item>
    <el-menu-item index="4" style="float: right;" :route="{ path: '/'}" v-else>
      <span>ログイン</span>
    </el-menu-item>
    <el-menu-item index="5" style="float: right;" :route="{ path: '/todos/new' }">
      新規TODO作成
    </el-menu-item>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['user'])
  }
}
</script>
