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
    const [userDocRef] = useAtom<firebase.firestore.DocumentSnapshot | undefined>(userDocRefAtom)
    const [orderBy, setOrderBy] = useState("createdAt")
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc")

    const [collections, loadingCollections, collectionsError] = useCollection(
        userDocRef?.ref.collection("collections")
            .orderBy(orderBy, orderDirection)
    )

    if (collectionsError) {
        console.error(collectionsError)
    }

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

    const createCollection = async (withBoard: boolean) => {
        const batch = firebase.firestore().batch()

        const newCollectionRef = userDocRef?.ref.collection("collections").doc()
        newCollectionRef && batch.set(newCollectionRef, {
            name: newCollectionName || "new Collection",
            owner: userDocRef?.ref,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            tags: newCollectionTags,
            pinned: false,
            deleted: false
        })

        let newBoardRef
        if (withBoard) {
            newBoardRef = newCollectionRef?.collection("boards").doc()
            newBoardRef && batch.set(newBoardRef, {
                name: "new Board",
                owner: userDocRef?.ref,
                collection: newCollectionRef,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
        }

        setNewCollectionName("")
        setNewCollectionTags([])
        setNewCollectionTag("")

        batch.commit()
        return [newCollectionRef, newBoardRef]
    }

    const onDrop = async (files: File[]) => {
        const [collection, board] = await createCollection(files.length > 0)

        if (collection && board) {
            for (const file of files) {
                userDocRef && uploadFile(file, userDocRef.ref, collection, board)
            }
        }
    }
    const { getRootProps, isDragActive } = useDropzone({ onDrop })

    return <Container>
        <CreateCollectionForm
            {...getRootProps({ isDragActive })}>
            <input
                type="text"
                placeholder={"Collection Name"}
                value={newCollectionName}
                onChange={event => setNewCollectionName(event.target.value)} />
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
                    createCollection(false)
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
            {collections?.docs
                .filter(collection => !collection.get("deleted"))
                .map(collection => (
                    <Collection
                        key={collection.id}
                        collection={collection} />
                ))}
            {collections?.docs.find(collection => collection.get("deleted")) && <Row>
                <Cell>
                    Deleted:
                </Cell>
            </Row>}
            {collections?.docs
                .filter(collection => collection.get("deleted"))
                .map(collection => (
                    <Collection
                        key={collection.id}
                        collection={collection} />
                ))}
        </Overflow>
    </Container >
}
