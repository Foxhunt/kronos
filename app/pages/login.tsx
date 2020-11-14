import { useRouter } from 'next/router'
import { useState } from 'react'

import firebase from "../firebase/clientApp"

export default function login() {
    const router = useRouter()

    const [login, setLogin] = useState(true)
    const [eMail, setEMail] = useState("")
    const [password, setPassword] = useState("")

    return <form
        onSubmit={async event => {
            event.preventDefault()
            let credentials: firebase.auth.UserCredential | undefined = undefined
            try {
                if (login) {
                    credentials = await firebase.auth().signInWithEmailAndPassword(eMail, password)
                } else {
                    credentials = await firebase.auth().createUserWithEmailAndPassword(eMail, password)
                }
            } catch (error) {
                if (error.code === "auth/user-not-found") {
                    setLogin(false)
                }
            } finally {
                if (credentials?.user) {
                    firebase.analytics().setUserId(credentials.user.uid)
                    if (credentials?.additionalUserInfo?.isNewUser) {
                        firebase.analytics().logEvent(
                            firebase.analytics.EventName.SIGN_UP,
                            { method: firebase.auth.EmailAuthProvider.PROVIDER_ID }
                        )
                    }
                    router.push("/")
                }
            }
        }}>
        <div>
            <label>E-Mail</label>
            <input
                type="email"
                value={eMail}
                onChange={event => {
                    setEMail(event.target.value)
                }} />
        </div>
        <div>
            <label>Password</label>
            <input
                type="password"
                value={password}
                onChange={event => {
                    setPassword(event.target.value)
                }} />
        </div>
        {!login && <>User not found, want to sign up?<br /></>}
        <button type="submit">
            {login ? "Login" : "Sign Up"}
        </button>
    </form>
}
