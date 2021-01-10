import firebase from "../firebase/clientApp"
import { atom } from "jotai"

export const userDocRefAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)

export const selectedClientDocRefAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)
export const selectedProjectDocRefAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)
export const selectedTaskDocRefAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)
export const selectedCollectionDocRefAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)

export type orderOptions = {
    orderBy: "createdAt" | "lastUpdatedAt" | "clientName" | "projectName" | "name" | "pinned" | "random",
    orderDirection: "asc" | "desc"
}

export const filterOrderByAtom = atom<orderOptions>({ orderBy: "createdAt", orderDirection: "desc" })
export const filterFavoriteAtom = atom<boolean>(false)
export const filterMarkedAtom = atom<boolean>(false)
export const filterTagsAtom = atom<string[]>([])
export const filterClientsAtom = atom<firebase.firestore.DocumentSnapshot[]>([])

export const showInteractionBarAtom = atom<boolean>(false)
export const showAddCollectionAtom = atom<boolean>(false)

export const selectedFilesAtom = atom<firebase.firestore.DocumentSnapshot[]>([])

export const previewFileAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)

export const searchFileAtom = atom<string>("")
