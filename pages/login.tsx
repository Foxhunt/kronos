import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import firebase from "../firebase/clientApp"

const uiConfig: firebaseui.auth.Config = {
    signInSuccessUrl: "/",
    credentialHelper: 'none',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    tosUrl: "/",
    privacyPolicyUrl: "/"
}

export default function Login() {
    return (typeof window !== 'undefined') ? <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/> : null
}