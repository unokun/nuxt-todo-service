import firebase from '~/plugins/firebase'

describe('env', () => {
  test('apiKey', () => {
    expect(process.env.FIREBASE_APIKEY).toBeDefined()
  }),
  test('authDomain', () => {
    expect(process.env.FIREBASE_AUTHDOMAIN).toBeDefined()
  }),
  test('databaseURL', () => {
    expect(process.env.FIREBASE_DATABASEURL).toBeDefined()
  }),
  test('projectId', () => {
    expect(process.env.FIREBASE_PROJECTID).toBeDefined()
  }),
  test('storageBucket', () => {
    expect(process.env.FIREBASE_STORAGEBUCKET).toBeDefined()
  }),
  test('messagingSenderId', () => {
    expect(process.env.FIREBASE_MESSAGINGSENDERID).toBeDefined()
  })
})
describe('firebase', () => {
  describe('initializeApp succeed', () => {
    test('firebase.apps.length is greater than 0', () => {
      expect(firebase.apps.length).toBeGreaterThan(0)
    })
  })
})
