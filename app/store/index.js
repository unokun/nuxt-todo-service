import firebase from '~/plugins/firebase'
// import moment from '~/plugins/moment'

export const strict = false

export const state = () => ({
  isLoggedIn: false,
  isLoggingIn: false,
  user: null,
  todos: []
})

export const getters = {
  isLoggedIn: (state) => state.isLoggedIn,
  isLoggingIn: (state) => state.isLoggingIn,
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
   * @param {*} param0 
   * @param {*} param1 
   */
  getUserPosts({ commit }, { user }) {
    // TODO初期化
    commit ('initTodos', { })

    // TODO一覧取得
    const db = firebase.firestore()
    db.collection("users").doc(user.id).collection("todos")
      .get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          console.log(doc, " => ", doc.data())
          const data = doc.data()
          const { title, body } = data
          // timestamp(firestore) -> date(js)
          // [TODO]strict=falseにしないとエラーになる
          const created_at = data.created_at.toDate()

          commit ('addTodo', { todo: { title, body, created_at } })
      })
  })
  }
}
