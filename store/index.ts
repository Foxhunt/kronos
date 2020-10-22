import { atom } from "jotai"

export const userDocRefAtom = atom<firebase.firestore.DocumentReference | undefined>(undefined)

export const selectedClientDocRefAtom = atom<firebase.firestore.DocumentReference | undefined>(undefined)
export const selectedProjectDocRefAtom = atom<firebase.firestore.DocumentReference | undefined>(undefined)
export const selectedTaskDocRefAtom = atom<firebase.firestore.DocumentReference | undefined>(undefined)

export const collectionsColRefAtom = atom<firebase.firestore.DocumentReference | undefined>(undefined)
export const filesColRefAtom = atom<firebase.firestore.DocumentReference | undefined>(undefined)
