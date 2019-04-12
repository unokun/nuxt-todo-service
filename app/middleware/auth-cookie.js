import Cookies from 'universal-cookie'

export default ({ req, store }) => {
  if (process.browser) {
    return
  }
  const cookies = new Cookies (req.headers.cookies)
  const user = cookies.get ('user')
  if (user && user.id) {
    const { id, name, email } = user
    store.commit ('setUser', { user: { id: id, name: name, email: email }})
  }
}