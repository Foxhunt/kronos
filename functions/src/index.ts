import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
admin.initializeApp()

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const createNewUser = functions.region("europe-west1").auth.user().onCreate(async user => {
    try {
        await admin.firestore().collection("users").doc(user.uid).set({
            email: user.email
        })
        functions.logger.info(`createrd user ${user.email}`)
    } catch (error) {
        functions.logger.error(error)
    }
})
