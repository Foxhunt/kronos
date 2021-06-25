import Head from "next/head"
import styled from "styled-components"
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import firebase from "../firebase/clientApp"

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const Form = styled.form`
    margin-top: 10px;
`

const Input = styled.input`
    margin: 10px 0px;
`

const EnterMailHint = styled.div`
    position: absolute;
    margin: 10px 0px;
`

export default function Login() {
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
        <Form
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
            <label>
                <div>
                    Email
                </div>
                <Input
                    type="email"
                    value={eMail}
                    required
                    onChange={async event => {
                        setEMail(event.target.value)
                    }} />
            </label>
            <label>
                <div>
                    Password
                </div>
                <Input
                    type="password"
                    value={password}
                    required
                    minLength={6}
                    onChange={event => {
                        setPassword(event.target.value)
                    }} />
            </label>
            <div>
                <button type="submit">
                    {accountExists ? "Login" : "Sign Up"}
                </button>
            </div>
            {!accountExists && <EnterMailHint>Enter your Email to login or sign up</EnterMailHint>}
        </Form>
    </Container>
}
