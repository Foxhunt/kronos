import firebase from "../firebase/clientApp"
import Head from "next/head"

import { useAtom } from "jotai"
import {
    previewFileAtom,
    selectedCollectionDocRefAtom,
    showInteractionBarAtom,
    userDocRefAtom
} from "../store"

import BoardBar from "../components/BoardBar"
import InteractionBar from "../components/InteractionBar"
import FileGrid from "../components/FileGrid"
import { useRouter } from "next/router"
import { useCollection } from "react-firebase-hooks/firestore"

export default function Archive() {
    const router = useRouter()
    const [showInteractionBar] = useAtom(showInteractionBarAtom)
    const [previewFile] = useAtom(previewFileAtom)
    const [userDocRef] = useAtom(userDocRefAtom)
    const [selectedBoard] = useAtom(selectedCollectionDocRefAtom)

    const collectionID = router.query.collection as string
    const collection = userDocRef?.ref.collection("collections").doc(collectionID)
    const [boards, boardsLoading, boardsError] = useCollection(
        collection?.collection("boards").orderBy("createdAt", "desc")
    )

    if (boardsError) {
        console.error(boardsError)
    }

    const fileQuerry = firebase.apps.length > 0 && collection && !selectedBoard ?
        firebase.firestore().collectionGroup("files").where("collection", "==", collection).orderBy("createdAt", "desc")
        :
        selectedBoard?.ref.collection("files").orderBy("createdAt", "desc")

    const [files, filesLoading, filesError] = useCollection(fileQuerry)

    if (filesError) {
        console.error(filesError)
    }

    return <>
        <Head>
            <title>Archive</title>
            <link rel="shortcut icon" href="/grid.svg" />
        </Head>
        {showInteractionBar && <InteractionBar />}
        {!boardsLoading && !previewFile &&
            <BoardBar boards={boards?.docs} />
        }
        {filesLoading && <div>loading ...</div>}
        {files &&
            <FileGrid
                files={files?.docs} />
            // getRootProps={getRootProps} />
        }
    </>
}
