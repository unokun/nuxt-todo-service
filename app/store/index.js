import firebase from '~/plugins/firebase'
import moment from '~/plugins/moment'

// [TODO]
// Error: [vuex] do not mutate vuex store state outside mutation handlers.
// getUserPosts内のaddTodoで発生
export const strict = false

export const state = () => ({
  isLoggedIn: false,
  user: null,
  todos: []
})

export const getters = {
  isLoggedIn: (state) => state.isLoggedIn,
  user: (state) => state.user,
  todos: (state) => state.todos
}

export const mutations = {
  setUser (state, {user}) {
    state.user = user
    state.isLoggedIn = true
  },
  addTodo (state, {todo}) {
    state.todos.push(todo)
  },
  initTodos (state, {}) {
    state.todos = []
  }
}

export const actions = {
  /*
  ** OAuth(google)
  */
  async googleLogin ({commit}) {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(provider)
    commit('setLoggingIn', { } )
  },
  /*
  ** ユーザー情報(表示名、メールアドレス)
   */
  setUser({ commit }, { user }) {
    commit ('setUser', { user })
  },

  /**
   * ユーザーのTODO一覧取得
   */
  getUserPosts({ commit }, { user }) {
    // TODO初期化
    commit ('initTodos', { })

    // TODO一覧取得
    const db = firebase.firestore()
    db.collection("users").doc(user.id).collection("todos")
      .get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // console.log(doc, " => ", doc.data())
          const id = doc.id
          const data = doc.data()
          const { title, body, created_at } = data
          commit ('addTodo', { todo: { id, title, body, created_at } })
      })
    })
  },
  /**
   * TODO登録
   */
  publishTodo({ commit }, { payload }) {
    const {userid, title, body} = payload
    const created_at = moment().format()
    const db = firebase.firestore()
    // IDは自動生成
    db.collection("users").doc(userid).collection("todos")
      .add({
        title: title,
        body: body,
        created_at: created_at
      })
  }
}
