import { atom } from "jotai"

export const userDocRefAtom = atom<firebase.firestore.DocumentReference | undefined>(undefined)

export const clientsColRefAtom = atom<firebase.firestore.CollectionReference | undefined>(undefined)
export const projectsColRefAtom = atom<firebase.firestore.CollectionReference | undefined>(undefined)
export const tasksColRefAtom = atom<firebase.firestore.CollectionReference | undefined>(undefined)
export const collectionsColRefAtom = atom<firebase.firestore.CollectionReference | undefined>(undefined)
export const filesColRefAtom = atom<firebase.firestore.CollectionReference | undefined>(undefined)
