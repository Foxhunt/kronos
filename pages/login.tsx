import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import { useRouter } from 'next/router'

import firebase from "../firebase/clientApp"

export default function Login() {
    const router = useRouter()
    const uiConfig: firebaseui.auth.Config = {
        signInSuccessUrl: "/",
        credentialHelper: 'none',
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccessWithAuthResult: authResult => {
                firebase.analytics().setUserId(authResult.user.uid)
                if (authResult.additionalUserInfo.isNewUser) {
                    firebase.firestore().collection("users").doc(authResult.user.uid).set({
                        name: authResult.user.displayName,
                        email: authResult.user.email
                    })
                    firebase.analytics().logEvent(firebase.analytics.EventName.SIGN_UP, { method: firebase.auth.EmailAuthProvider.PROVIDER_ID })
                }
                router.push("/")
                return false
            }
        },
        tosUrl: "/",
        privacyPolicyUrl: "/"
    }

    return (typeof window !== 'undefined') ? <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} /> : null
}
