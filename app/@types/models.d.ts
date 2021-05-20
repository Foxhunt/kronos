interface User {
    email: string

    //subcollections
    collections: Collection[]
}

interface Collection {
    name: string
    createdAt: FieldValue
    lastUpdatedAt: FieldValue
    pinned: boolean
    deleted: boolean
    tags: string[]

    //references
    owner: User
    sharedWith: User[]

    //subcollections
    boards: Board[]
}
interface Board {
    name: string
    createdAt: Date
    lastUpdatedAt: Date
    tags: string[]

    //references
    owner: User
    collection: Collection

    //subcollections
    files: File[]
}

interface File {
    name: string
    createdAt: Date
    lastUpdatedAt: Date
    downloadURL: string
    tags: string[]

    //references
    owner: User
    collection: Collection
    board: Board
}