import { User } from 'firebase'
import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import firebase from '../firebase/clientApp'

type UserContextValue = {
  user: User | null,
  logout: () => void,
  loadingUser: boolean,
} | null

export const UserContext = createContext<UserContextValue>(null)

type props = {
  children: ReactNode
}

export default function UserContextComp({ children }: props) {
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true) // Helpful, to update the UI accordingly.

  useEffect(() => {
    // Listen authenticated user
    const unsubscriber = firebase.auth().onAuthStateChanged(async (user) => {
      try {
        if (user) {
          // User is signed in.
          // You could also look for the user doc in your Firestore (if you have one):
          // const userDoc = await firebase.firestore().doc(`users/${uid}`).get()
          setUser(user)

          firebase.analytics().logEvent(firebase.analytics.EventName.LOGIN, { method: firebase.auth.EmailAuthProvider.PROVIDER_ID })
          firebase.analytics().setUserId(user.uid)
        } else setUser(null)
      } catch (error) {
        // Most probably a connection error. Handle appropriately.
      } finally {
        setLoadingUser(false)
      }
    })

    // Unsubscribe auth listener on unmount
    return () => unsubscriber()
  }, [])

  const logout = () => {
    firebase.auth().signOut()
  }

  return (
    <UserContext.Provider value={{ user, logout, loadingUser }}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook that shorhands the context!
export const useUser = () => useContext(UserContext)