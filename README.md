# nuxt-todo-service

Nuxt.jsビギナーズガイドの4章(blog)を参考に、Firestore連携機能付きTODOサービスを作成しました。

### プロジェクト作成

``` bash
# project作成
# Element UI
$ yarn create nuxt-app nuxt-todo-service

# モジュール追加
$ yarn add moment universal-cookie lodash.clonedeep
```

### Firebase設定

Firebaseのプロジェクトは事前に作成している前提です。

[Cloud Firestore with Vue\.jsで簡単なメモアプリを実装する \- Qiita](https://qiita.com/rubytomato@github/items/78087a2c69389f642760)

```bash
$ yarn add firebase firebase-tools

# direnvを使ってAPI Keyなどを外部から設定
$ cat .envrc
export FIREBASE_APIKEY=APIキー
export FIREBASE_AUTHDOMAIN=
export FIREBASE_DATABASEURL=
export FIREBASE_PROJECTID=
export FIREBASE_STORAGEBUCKET=
export FIREBASE_MESSAGINGSENDERID=

# nuxt.conf.jsに追加
$ cat nuxt.conf.js
  env: {
    FIREBASE_APIKEY: process.env.FIREBASE_APIKEY,
    FIREBASE_AUTHDOMAIN: process.env.FIREBASE_AUTHDOMAIN,
    FIREBASE_DATABASEURL: process.env.FIREBASE_DATABASEURL,
    FIREBASE_PROJECTID: process.env.FIREBASE_PROJECTID,
    FIREBASE_STORAGEBUCKET: process.env.FIREBASE_STORAGEBUCKET,
    FIREBASE_MESSAGINGSENDERID: process.env.FIREBASE_MESSAGINGSENDERID
  },
```

##### plugin/firebase.js

firebaseはplugin化しておきます。

```javascript
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

if (!firebase.apps.length) { // 初期化が複数回実行されることを防ぐ
  firebase.initializeApp({
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTHDOMAIN,
    databaseURL: process.env.FIREBASE_DATABASEURL,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID
  })
}

export default firebase
```

### Firestoreデータ構造

TodoはUserのサブコレクションとして作成しました。

UserのドキュメントIDはuid、TodoのドキュメントIDは自動生成としました。

以下の記事が参考になりました。

[Cloud Firestoreの勘所 パート2 — データ設計 – google\-cloud\-jp – Medium](https://medium.com/google-cloud-jp/firestore2-920ac799345c)

| Users(コレクション) | User        | Todos(コレクション) | Todo               |
| ------------------- | ----------- | ------------------- | ------------------ |
|                     | uid         |                     | title：文字列      |
|                     | displayName |                     | body：文字列       |
|                     | email       |                     | created_at：文字列 |

### 画面一覧

#### 起動画面

Google認証後、TODO一覧画面に遷移します。

FirebaseプロジェクトでGoogle認証を有効にしておく必要があります。

store(index.js)のactionに実装しましたが、画面(vue)でもOKです。

```javascript
import firebase from '~/plugins/firebase'

const provider = new firebase.auth.GoogleAuthProvider()
firebase.auth().signInWithRedirect(provider)
```

signInWithRedirectを呼び出すと初回はGoogleの認証画面が表示されます。

画面表示時に、リスナー登録(onAuthStateChanged)しておくと、ユーザー情報を取得することができます。

firebase.auth().getRedirectResult()でも取得できますが、onAuthStateChangedの方が処理が早かったので使いました。

[quickstart\-js/google\-redirect\.html at master · firebase/quickstart\-js](https://github.com/firebase/quickstart-js/blob/master/auth/google-redirect.html)

##### pages/index.vue

```javascript
export default {
  async asyncData ({ redirect, store }) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        # ユーザー情報をstoreに登録
        const { uid, displayName, email } = user
        store.dispatch ('setUser', { user: { id: uid, name: displayName, email: email }})

        # クッキー登録
        const cookies = new Cookies()
        const cookie = {id: uid, name: displayName, email: email}
        cookies.set('user', JSON.stringify(cookie))
        redirect('/todos')
      }
    })
    return {
    }
  },
  ...
}
```

##### store/index.js

```javascript
export const state = () => ({
  user: null,  // ログインユーザー
  todos: []    // ユーザーが登録したTODO一覧
})

export const mutations = {
  setUser (state, {user}) {
    state.user = user
  },
}
export const actions = {
  setUser({ commit }, { user }) {
    commit ('setUser', { user })
  },
}
```

#### TODO一覧画面

ユーザーのTODO一覧をFirestoreから取得します

##### pages/todos/index.vue

画面表示のタイミングでユーザーのTODO一覧を取得します。

TODO一覧データ(showTodos)を画面の要素(table)にマッピングします。

```javascript
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

```

##### store/index.js

```javascript
  getUserPosts({ commit }, { user }) {
    // TODO初期化
    commit ('initTodos', { })

    // TODO一覧取得
    const db = firebase.firestore()
    db.collection("users").doc(user.id).collection("todos")
      .get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          const id = doc.id // documentのIDをTodoデータのIDに設定
          const data = doc.data()
          const { title, body, created_at } = data
          commit ('addTodo', { todo: { id, title, body, created_at } })
      })
    })
  },
```

#### TODO作成画面

TODOをFirestoreに登録します。

##### store/index.js

```javascript
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
```



## リンク

* [Firebase Authentication  \|  Firebase](https://firebase.google.com/docs/auth/?hl=ja)

* [Cloud Firestore データモデル  \|  Firebase](https://firebase.google.com/docs/firestore/data-model?hl=ja)

* [Cloud Firestore でデータを取得する  \|  Firebase](https://firebase.google.com/docs/firestore/query-data/get-data?hl=ja)

  