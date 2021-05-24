import firebase from "../../firebase/clientApp"
import { useCollection } from "react-firebase-hooks/firestore"

import Collection from "./Collection"
import uploadFile from "../../firebase/uploadFile"
import { useState } from "react"

import { useAtom } from "jotai"
import { userDocRefAtom } from "../../store"

import { Container, CreateCollectionForm, CreateCollection, Row, Cell, StyledIconDownSVG, StyledIconUpSVG, Overflow } from "./CollectionComponents"
import { useDropzone } from "react-dropzone"

export default function CollectionList() {
    const [userDocRef] = useAtom<firebase.firestore.DocumentSnapshot>(userDocRefAtom)
    const [orderBy, setOrderBy] = useState("createdAt")
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc")

    const [collections, loadingCollections] = useCollection(
        userDocRef?.ref.collection("collections")
            .where("deleted", "==", false)
            .orderBy(orderBy, orderDirection)
    )

    const [deletedCollections, loadingDeletedCollections] = useCollection(
        userDocRef?.ref.collection("collections")
            .where("deleted", "==", true)
            .orderBy(orderBy, orderDirection)
    )

    const setOrder = (newOrderBy: string) => {
        if (orderBy === newOrderBy) {
            setOrderDirection(orderDirection === "desc" ? "asc" : "desc")
        } else {
            setOrderBy(newOrderBy)
            setOrderDirection(["createdAt", "lastUpdatedAt", "pinned"].includes(newOrderBy) ? "desc" : "asc")
        }
    }

    const [newCollectionName, setNewCollectionName] = useState("")
    const [newCollectionTags, setNewCollectionTags] = useState<string[]>([])
    const [newCollectionTag, setNewCollectionTag] = useState("")

    const createCollection = async () => {
        const batch = firebase.firestore().batch()

        const newCollectionRef = userDocRef?.ref.collection("collections").doc()
        batch.set(newCollectionRef, {
            name: newCollectionName || "new Collection",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            tags: newCollectionTags,
            pinned: false,
            deleted: false
        })

        const newBoardRef = newCollectionRef?.collection("boards").doc()
        batch.set(newBoardRef, {
            name: "new Board",
            collection: newCollectionRef,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })

        setNewCollectionName("")
        setNewCollectionTags([])
        setNewCollectionTag("")

        batch.commit()
        return [newCollectionRef, newBoardRef]
    }

    const onDrop = async (files: File[]) => {
        const [collection, board] = await createCollection()

        for (const file of files) {
            uploadFile(file, collection, board)
        }
    }
    const { getRootProps, isDragActive } = useDropzone({ onDrop })

    return <Container>
        <CreateCollectionForm
            {...getRootProps({ isDragActive })}>
            <label>
                <input
                    type="text"
                    placeholder={"Collection Name"}
                    value={newCollectionName}
                    onChange={event => setNewCollectionName(event.target.value)} />
            </label>
            <label>
                {newCollectionTags.map(tag => <span key={tag}> {tag}</span>)}
                <input
                    type="text"
                    placeholder={"Tags"}
                    value={newCollectionTag}
                    onKeyDown={event => {
                        if (event.key === 'Enter' && newCollectionTag) {
                            event.preventDefault()
                            setNewCollectionTags([...newCollectionTags, newCollectionTag])
                            setNewCollectionTag("")
                        }
                    }
                    }
                    onChange={event => setNewCollectionTag(event.target.value)} />
            </label>
            <CreateCollection
                onClick={event => {
                    event.preventDefault()
                    createCollection()
                }}>
                Create Collection +
            </CreateCollection>
        </CreateCollectionForm>
        <Row>
            <Cell onClick={() => setOrder("createdAt")}>
                UPLOADED {orderBy === "createdAt" && <> {orderDirection === "desc" ? <StyledIconDownSVG /> : <StyledIconUpSVG />} </>}
            </Cell>
            <Cell
                onClick={() => setOrder("lastUpdatedAt")}>
                CHANGED {orderBy === "lastUpdatedAt" && <> {orderDirection === "desc" ? <StyledIconDownSVG /> : <StyledIconUpSVG />} </>}
            </Cell>
            <Cell
                onClick={() => setOrder("name")}>
                Name
                {orderBy === "name" && <>{orderDirection === "desc" ? <StyledIconDownSVG /> : <StyledIconUpSVG />}</>}
            </Cell>
            <Cell>
                Boards
            </Cell>
            <Cell
                onClick={() => setOrder("pinned")}>
                PIN {orderBy === "pinned" && <>{orderDirection === "desc" ? <StyledIconDownSVG /> : <StyledIconUpSVG />}</>}
            </Cell>
        </Row>
        <Overflow>
            {loadingCollections && <div>loading ...</div>}
            {collections?.docs.map(collection => (
                <Collection
                    key={collection.id}
                    collection={collection} />
            ))}
            {!deletedCollections?.empty && <Row>
                <Cell>
                    Deleted:
                </Cell>
            </Row>}
            {loadingDeletedCollections && <div>loading ...</div>}
            {deletedCollections?.docs.map(collection => (
                <Collection
                    key={collection.id}
                    collection={collection} />
            ))}
        </Overflow>
    </Container >
}
