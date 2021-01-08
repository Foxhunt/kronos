import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
admin.initializeApp()

import { ImageAnnotatorClient } from "@google-cloud/vision"

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

export const labelImage = functions.region("europe-west1").https.onCall(async data => {
    try {
        const snapshot = await admin.firestore().doc(data.path).get()
        const bucket = admin.storage().bucket()
        const filePath = snapshot.get("fullPath")
        const fileRef = bucket.file(filePath)
        const [metadata] = await fileRef.getMetadata()

        //@ts-ignore
        if (metadata?.contentType?.startsWith("image/")) {
            const client = new ImageAnnotatorClient()
            const [result] = await client.labelDetection(`gs://${bucket.name}/${filePath}`)

            const mlLabels = result.labelAnnotations?.map(annotation => annotation.description)

            await snapshot.ref.update({
                mlLabels
            })
        }
    } catch (error) {
        functions.logger.error(error)
    }
})
