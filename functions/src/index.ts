import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
admin.initializeApp()

import { ImageAnnotatorClient } from "@google-cloud/vision"

export const createNewUser = functions
    .region("europe-west1")
    .auth
    .user()
    .onCreate(async user => {
        try {
            await admin.firestore().collection("users").doc(user.uid).set({
                email: user.email,
                level1: "Level I",
                level2: "Level II",
                level3: "Level III"
            })
            functions.logger.info(`createrd user ${user.email}`)
        } catch (error) {
            functions.logger.error(error)
        }
    })

export const labelImage = functions
    .region("europe-west1")
    .firestore
    .document("/users/{userID}/files/{fileID}")
    .onCreate(async snapshot => {
        try {
            const bucket = admin.storage().bucket()
            const filePath = snapshot.get("fullPath")
            const fileRef = bucket.file(filePath)
            const [metadata] = await fileRef.getMetadata()

            //@ts-ignore
            if (metadata?.contentType?.startsWith("image/")) {
                const client = new ImageAnnotatorClient()
                const imagePath = `gs://${bucket.name}/${filePath}`

                const [results] = await client.annotateImage({
                    image: { source: { imageUri: imagePath } },
                    features: [{ type: "LABEL_DETECTION", maxResults: 10 }]
                })

                const mlLabels = results.labelAnnotations?.map(annotation => annotation.description)

                await snapshot.ref.update({
                    mlLabels
                })
            }
        } catch (error) {
            functions.logger.error(error)
        }
    })
