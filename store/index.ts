import { atom } from "jotai"

export const userDocRefAtom = atom<firebase.firestore.DocumentReference | undefined>(undefined)

export const selectedClientDocRefAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)
export const selectedProjectDocRefAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)
export const selectedTaskDocRefAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)

export const pathAtom = atom(get => {
    const clientName = get(selectedClientDocRefAtom)?.get("name")
    const projectName = get(selectedProjectDocRefAtom)?.get("name")
    const taskName = get(selectedTaskDocRefAtom)?.get("name")

    const path = [clientName, projectName, taskName].filter(crumb => crumb !== undefined)

    return path.length ? path.join(" / ") : "Folders"
})

export const selectedCollectionDocRefAtom = atom<firebase.firestore.DocumentSnapshot | undefined>(undefined)

export const filesColRefAtom = atom<firebase.firestore.DocumentReference | undefined>(undefined)
