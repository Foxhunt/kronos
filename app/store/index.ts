import firebase from "../firebase/clientApp"
import { atom } from "jotai"

import { sortByOptions } from "../components/Filter"

export const userDocRefAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)

export const clientsAtom = atom<firebase.firestore.DocumentSnapshot[]>([])
export const selectedClientDocRefAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)

export const projectsAtom = atom<firebase.firestore.DocumentSnapshot[]>([])
export const selectedProjectDocRefAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)

export const tasksAtom = atom<firebase.firestore.DocumentSnapshot[]>([])
export const selectedTaskDocRefAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)

export const boardsAtom = atom<firebase.firestore.DocumentSnapshot[]>([])
export const selectedCollectionDocRefAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)

export const filesToUploadAtom = atom<File[]>([])

export type orderOptions = {
    displayName: string
    orderBy: "createdAt" | "lastUpdatedAt" | "clientName" | "projectName" | "name" | "pinned" | "random",
    orderDirection: "asc" | "desc"
}

export const filterOrderByAtom = atom<orderOptions>(sortByOptions[0])
export const filterFavoriteAtom = atom<boolean>(false)
export const filterMarkedAtom = atom<boolean>(false)
export const filterTagsAtom = atom<string[]>([])

export const showInteractionBarAtom = atom<boolean>(false)
export const showFoldersAtom = atom<boolean>(false)

export const selectedFilesAtom = atom<firebase.firestore.DocumentSnapshot[]>([])

export const previewFileAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)

export const searchFileAtom = atom<string>("")
