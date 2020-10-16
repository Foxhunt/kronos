import { atom } from "jotai"

export const userDocAtom = atom<firebase.firestore.DocumentReference | null>(null)
