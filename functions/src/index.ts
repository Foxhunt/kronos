import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
admin.initializeApp()

import { ImageAnnotatorClient } from "@google-cloud/vision"

import algoliasearch from "algoliasearch"
const ALGOLIA_ID = functions.config().algolia.app_id
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key
const algoliaClient = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)

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

            await snapshot.ref.update({
                mlLabels: result.labelAnnotations
            })
        }
    } catch (error) {
        functions.logger.error(error)
    }
})

export const indexTags = functions.region("europe-west1").firestore.document("/users/{userID}/tags/{tagId}").onCreate((snap, context) => {
    const tag = snap.data()

    tag.objectID = context.params.tagId

    const index = algoliaClient.initIndex(`${context.params.userID}_tags`)
    return index.saveObject(tag)
})
