import firebase from "../firebase/clientApp"
import { atom } from "jotai"

export const userDocRefAtom = atom<firebase.firestore.DocumentReference | undefined>(undefined)

export const selectedClientDocRefAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)
export const selectedProjectDocRefAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)
export const selectedTaskDocRefAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)
export const selectedCollectionDocRefAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)

export const pathAtom = atom<string, firebase.firestore.DocumentSnapshot[]>(
    get => {
        const clientName = get(selectedClientDocRefAtom)?.get("name")
        const projectName = get(selectedProjectDocRefAtom)?.get("name")
        const taskName = get(selectedTaskDocRefAtom)?.get("name")

        const path = [clientName, projectName, taskName].filter(crumb => crumb !== undefined)

        return path.length ? " - " + path.join(" / ") : ""
    },
    (_, set, [client, project, task]) => {
        set(selectedClientDocRefAtom, client)
        set(selectedProjectDocRefAtom, project)
        set(selectedTaskDocRefAtom, task)
        set(selectedCollectionDocRefAtom, undefined)
    }
)

export type orderOptions = {
    orderBy: "createdAt" | "lastUpdatedAt" | "clientName" | "projectName" | "name" | "pinned",
    orderDirection: "asc" | "desc"
}

export const filterOrderByAtom = atom<orderOptions>({ orderBy: "createdAt", orderDirection: "desc" })
export const filterFavoriteAtom = atom<boolean>(false)
export const filterMarkedAtom = atom<boolean>(false)
export const filterTagsAtom = atom<firebase.firestore.DocumentSnapshot[]>([])
export const filterClientsAtom = atom<firebase.firestore.DocumentSnapshot[]>([])

export const showInteractionBarAtom = atom<boolean>(false)

export const selectedFilesAtom = atom<firebase.firestore.DocumentSnapshot[]>([])

export const previewFileAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)
