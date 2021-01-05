import Head from "next/head"
import styled from "styled-components"
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import firebase from "../firebase/clientApp"

const Container = styled.div`
    display: flex;
    justify-content: center;
`

export default function login() {
    const router = useRouter()

    const [eMail, setEMail] = useState("")
    const [password, setPassword] = useState("")

    const [accountExists, setAccountExists] = useState(false)
    useEffect(() => {
        async function checkSignIn() {
            try {
                if (eMail) {
                    const methods = await firebase.auth().fetchSignInMethodsForEmail(eMail)
                    setAccountExists(methods.includes("password"))
                }
            } catch (error) {
                setAccountExists(false)
                console.error(error.message)
            }
        }
        checkSignIn()
    }, [eMail])

    return <Container>
        <Head>
            <title>{accountExists ? "Login" : "Sign Up"}</title>
            <link rel="shortcut icon" href="/lock.svg" />
        </Head>
        <form
            onSubmit={async event => {
                event.preventDefault()
                let credentials: firebase.auth.UserCredential | undefined = undefined

                if (accountExists) {
                    credentials = await firebase.auth().signInWithEmailAndPassword(eMail, password)
                } else {
                    credentials = await firebase.auth().createUserWithEmailAndPassword(eMail, password)
                }

                if (credentials?.user) {
                    router.push("/")
                    firebase.analytics().setUserId(credentials.user.uid)
                    if (credentials?.additionalUserInfo?.isNewUser) {
                        firebase.analytics().logEvent(
                            firebase.analytics.EventName.SIGN_UP,
                            { method: firebase.auth.EmailAuthProvider.PROVIDER_ID }
                        )
                    }
                }
            }}>
            <div>
                <label>
                    Email <input
                        type="email"
                        value={eMail}
                        required
                        onChange={async event => {
                            setEMail(event.target.value)
                        }} />
                </label>
            </div>
            <div>
                <label>
                    Password <input
                        type="password"
                        value={password}
                        required
                        minLength={6}
                        onChange={event => {
                            setPassword(event.target.value)
                        }} />
                </label>
            </div>
            <button type="submit">
                {accountExists ? "Login" : "Sign Up"}
            </button>
            {!accountExists && <><br />Enter your Email to login or sign up</>}
        </form>
    </Container>
}
