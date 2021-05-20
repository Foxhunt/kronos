import firebase from "../../firebase/clientApp"
import { useCollection } from "react-firebase-hooks/firestore"

import Collection from "./Collection"
import { useState } from "react"

import { useAtom } from "jotai"
import { userDocRefAtom } from "../../store"
import { DropzoneRootProps } from "react-dropzone"

import { Container, CreateCollectionForm, CreateCollection, Row, Cell, StyledIconDownSVG, StyledIconUpSVG, Overflow } from "./CollectionComponents"

type props = {
    getRootProps?: (props?: DropzoneRootProps) => DropzoneRootProps
}

export default function CollectionList({ getRootProps }: props) {
    const [userDocRef] = useAtom(userDocRefAtom)
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

    return <Container
        {...(getRootProps ? getRootProps({}) : {})}>
        <CreateCollectionForm>
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
                onClick={async event => {
                    event.preventDefault()
                    const newCollectionRef = await userDocRef?.ref.collection("collections").add({
                        name: newCollectionName || "new Collection",
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                        tags: newCollectionTags,
                        pinned: false,
                        deleted: false
                    } as Collection)

                    await newCollectionRef?.collection("boards").add({
                        name: "new Board",
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    })

                    setNewCollectionName("")
                    setNewCollectionTags([])
                    setNewCollectionTag("")
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
            <Row>
                <Cell>
                    Deleted:
                </Cell>
            </Row>
            {loadingDeletedCollections && <div>loading ...</div>}
            {deletedCollections?.docs.map(collection => (
                <Collection
                    key={collection.id}
                    collection={collection} />
            ))}
        </Overflow>
    </Container>
}
