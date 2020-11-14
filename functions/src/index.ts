import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
admin.initializeApp()

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const createNewUser = functions.auth.user().onCreate(user => {
    admin.firestore().collection("users").doc(user.uid).set({
        email: user.email
    })
    functions.logger.info(`createrd user ${user.email}`)
})
